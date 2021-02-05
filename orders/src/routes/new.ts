import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@applinh/mcta-common';
import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order.model';
import { Ticket } from '../models/ticket.model';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../publishers/order-created.publisher';


const router = express.Router();

const EXPIRATION_ORDER_SECONDS = 1*60 // TODO: Change to get an env var

router.post(
    '/api/orders',
    requireAuth,
    [
        body("ticketId")
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // Checking if ticketID has the format of a mongo OID. To be removed/updated if the db is not mongo
        .withMessage("Ticket ID is incorrect")
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const ticket = await Ticket.findById(req.body.ticketId);


        if (!ticket) {
            throw new NotFoundError();
        }

        // Check if ticket is not already reserved in another order
        const existingOrderWithTicket = await ticket.isReserved();

        if (existingOrderWithTicket) {
            throw new BadRequestError("Ticket is already reserved by another order");
        }

        // Order expiration rule
        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + EXPIRATION_ORDER_SECONDS);

        const order = Order.build({
            status: OrderStatus.Created,
            ticket,
            userId: req.currentUser!.id,
            expiresAt: expirationDate

        });

        await order.save();

        await new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            ticket: {id: ticket.id, price: ticket.price},
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            __v: order.__v!
        });
        
        
        res.status(201).send(order);

    }
)

export { router as createOrderRouter };