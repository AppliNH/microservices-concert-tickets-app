import express, {Request, Response} from 'express';


const router = express.Router();

router.get(
    '/api/orders/:orderId',
    async (req: Request, res: Response) => {
        
        res.status(200).send({});

    }
)

export { router as showOrderRouter };