import express, {Request, Response} from 'express';
import { Order } from '../models/order.model';


const router = express.Router();

router.get(
    '/api/orders',
    async (req: Request, res: Response) => {
        
        res.status(200).send({});

    }
)

export { router as showAllOrderRouter };