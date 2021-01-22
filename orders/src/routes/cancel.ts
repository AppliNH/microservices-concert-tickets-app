import { NotFoundError, OrderStatus, requireAuth } from '@react-node-microservices-course/common';
import express, {Request, Response} from 'express';
import { Order } from '../models/order.model';


const router = express.Router();

router.patch(
    '/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        
        const order = await Order.findById(req.params.orderId);

        if(!order || order.userId !== req.currentUser!.id) {
            throw new NotFoundError()
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        res.status(204).send(order);

    }
)

export { router as cancelOrderRouter };