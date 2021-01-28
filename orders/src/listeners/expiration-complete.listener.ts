import { Message } from "node-nats-streaming";
import { ExpirationCompleteEvent, NotFoundError, OrderStatus } from "@react-node-microservices-course/common";
import {BaseListener} from '@react-node-microservices-course/common';
import { Subjects } from "@react-node-microservices-course/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../models/ticket.model";
import { Order } from "../models/order.model";
import { OrderCancelledPublisher } from "../publishers/order-cancelled.publisher";
import { natsWrapper } from "../nats-wrapper";

export class ExpirationCompleteListener extends BaseListener<ExpirationCompleteEvent> {
    subject:Subjects.ExpirationComplete = Subjects.ExpirationComplete; // This is needed to write it like that, to lock the var to the value.
                                                                // Indeed, ExpirationCompleteEvent implies a subject of type Subjects.ExpirationComplete
                                                                // But you can also write it like that => readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;


    // onMessage callback
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) {
            throw new NotFoundError();
        }

        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({status: OrderStatus.Cancelled});

        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            __v: order.__v!,
            ticket: {id: order.ticket.id}
        });

        msg.ack(); // Trigger acknowledge of message
    }

}