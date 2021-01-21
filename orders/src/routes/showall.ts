import { currentUser, requireAuth } from '@react-node-microservices-course/common';
import express, {Request, Response} from 'express';
import { Order } from '../models/order.model';


const router = express.Router();

router.get(
    '/api/orders',
    requireAuth,
    async (req: Request, res: Response) => {

        const orders = await Order.find({
            userId: req.currentUser!.id
        }).populate("ticket"); // Retrieves every tickets data
        
        

        res.status(200).send(orders);

    }
)

export { router as showAllOrderRouter };