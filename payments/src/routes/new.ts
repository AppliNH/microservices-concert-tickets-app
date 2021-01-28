import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@react-node-microservices-course/common";
import express, {Request, Response} from "express";
import {body} from 'express-validator';
import { stripe } from "../stripe";
import { Order } from "../models/order.model";
import { Payment } from "../models/payment.model";


const router = express.Router();


router.post("/api/payments",
    requireAuth,
    [
        // body("token")
        //     .not()
        //     .isEmpty(),
        body("orderId")
            .not()
            .isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { orderId} = req.body;
        
        const order = await Order.findById(orderId);

        if(!order) {
            throw new NotFoundError();
        }
 
        
        if(order.userId != req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError("Order is marked as cancelled")
        }

        const stripeResponse = await stripe.charges.create({
            currency: 'eur',
            amount: order.price * 100, // cts
            source: 'tok_visa'
        });

        const payment = Payment.build({
            orderId,
            stripeId: stripeResponse.id
        });

        await payment.save();


        res.status(201).send({success: true})
    }
);

export {router as createChargeRouter};