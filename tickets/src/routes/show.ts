import { NotFoundError, requireAuth, validateRequest } from '@react-node-microservices-course/common';
import {body} from 'express-validator';
import express, {Request, Response} from 'express';
import { Ticket } from '../models/ticket.model';

const router = express.Router();

router.get(
    '/api/tickets/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);
        
        if (!ticket) {
            throw new NotFoundError();
        }

        res.status(200).send(ticket);

    }
)

export { router as showTicketRouter };