import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@applinh/mcta-common";
import express, {Request, Response} from "express";
import {body} from 'express-validator';
import { stripe } from "../stripe";
import { Order } from "../models/order.model";
import { Payment } from "../models/payment.model";
import { PaymentCreatedPublisher } from "../publishers/payment-created.publisher";
import { natsWrapper } from "../nats-wrapper";


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
        
        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })


        res.status(201).send({success: true})
    }
);

export {router as createChargeRouter};