import { requireAuth, validateRequest } from '@react-node-microservices-course/common';
import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';


const router = express.Router();

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
        
        res.status(200).send({});

    }
)

export { router as createOrderRouter };