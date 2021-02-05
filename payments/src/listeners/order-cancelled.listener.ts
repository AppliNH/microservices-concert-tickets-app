import { Message } from "node-nats-streaming";
import { NotFoundError, OrderCancelledEvent, OrderStatus } from "@applinh/mcta-common";
import {BaseListener} from '@applinh/mcta-common';
import { Subjects } from "@applinh/mcta-common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../models/order.model";


// Will allow to lock a ticket if an order is being Cancelled for it
export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
    subject:Subjects.OrderCancelled = Subjects.OrderCancelled; // This is needed to write it like that, to lock the var to the value.
                                                                // Indeed, TicketCancelledEvent implies a subject of type Subjects.TicketCancelled
                                                                // But you can also write it like that => readonly subject = Subjects.TicketCancelled;
    queueGroupName = queueGroupName;


    // onMessage callback
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        
        const order = await Order.findOne({
            _id: data.id,
            __v: data.__v! -1
        });

        if (!order) {
            throw new NotFoundError();
        }

        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();
        
        msg.ack(); // Trigger acknowledge of message
    }

}