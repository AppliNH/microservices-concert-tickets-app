import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@react-node-microservices-course/common';
import {body} from 'express-validator';
import express, {Request, Response} from 'express';
import { Ticket } from '../models/ticket.model';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated.publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body("title")
            .not()
            .isEmpty()
            .withMessage("Title is required"),
        body("price")
            .not()
            .isEmpty()
            .withMessage('Price is required')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const ticket = await Ticket.findById(req.params.id);

        if(!ticket) {
            throw new NotFoundError();
        }


        if(ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }


        const {title, price} = req.body;
        ticket.set({
            title,
            price
        });

        await ticket.save();

        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            userId: ticket.userId,
            price: ticket.price,
            __v: ticket.__v!
        });


        res.status(200).send(ticket);
    }
);

export {router as updateTicketRouter };