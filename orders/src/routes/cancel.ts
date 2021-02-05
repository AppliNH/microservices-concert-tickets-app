import { NotFoundError, OrderStatus, requireAuth } from '@applinh/mcta-common';
import express, {Request, Response} from 'express';
import { Order } from '../models/order.model';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../publishers/order-cancelled.publisher';


const router = express.Router();

router.patch(
    '/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        
        const order = await Order.findById(req.params.orderId).populate('ticket');

        if(!order || order.userId !== req.currentUser!.id) {
            throw new NotFoundError()
        }

        order.status = OrderStatus.Cancelled;
        await order.save();


        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {id: order.ticket.id},
            __v : order.__v!
        });

        res.status(204).send(order);

    }
)

export { router as cancelOrderRouter };