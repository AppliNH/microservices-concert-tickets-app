import { Message } from "node-nats-streaming";
import { NotFoundError, OrderStatus, PaymentCreatedEvent } from "@react-node-microservices-course/common";
import {BaseListener} from '@react-node-microservices-course/common';
import { Subjects } from "@react-node-microservices-course/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../models/order.model";


export class PaymentCreatedListener extends BaseListener<PaymentCreatedEvent> {
    subject:Subjects.PaymentCreated = Subjects.PaymentCreated; // This is needed to write it like that, to lock the var to the value.
                                                                // Indeed, PaymentCreatedEvent implies a subject of type Subjects.PaymentCreated
                                                                // But you can also write it like that => readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;


    // onMessage callback
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new NotFoundError()
        }

        order.set({status: OrderStatus.Complete});

        await order.save();

        
        msg.ack(); // Trigger acknowledge of message
    }

}