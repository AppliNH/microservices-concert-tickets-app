import { NotFoundError, requireAuth } from '@react-node-microservices-course/common';
import express, {Request, Response} from 'express';
import { Order } from '../models/order.model';


const router = express.Router();

router.get(
    '/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        
        const order = await Order.findById(req.params.orderId).populate('ticket'); // Fetches data of the associated ticket
        

        if (!order || order.userId !== req.currentUser!.id) {
            throw new NotFoundError();
        }

        res.status(200).send(order);

    }
)

export { router as showOrderRouter };