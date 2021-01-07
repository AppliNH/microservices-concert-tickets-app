import { NotFoundError, requireAuth, validateRequest } from '@react-node-microservices-course/common';
import {body} from 'express-validator';
import express, {Request, Response} from 'express';
import { Ticket } from '../models/ticket.model';

const router = express.Router();

router.get(
    '/api/tickets',
    async (req: Request, res: Response) => {
        const tickets = await Ticket.find({});

        res.status(200).send(tickets);
    }
)

export { router as showAllTicketsRouter };