import { requireAuth, validateRequest } from '@react-node-microservices-course/common';
import {body} from 'express-validator';
import express, {Request, Response} from 'express';
import { Ticket } from '../models/ticket.model';
import { TicketCreatedPublisher } from '../publishers/ticket-created.publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/tickets',
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
   async  (req: Request, res: Response) => {

        const {title, price} = req.body;

        const ticket = Ticket.build({
            price,
            title,
            userId: req.currentUser!.id
        })

        await ticket.save();

        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            userId: ticket.userId,
            price: ticket.price,
            __v: ticket.__v!
        });
        
        res.status(201).send(ticket);


    });

export {router as createTicketRouter}