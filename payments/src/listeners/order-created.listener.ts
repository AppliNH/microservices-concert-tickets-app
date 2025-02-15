import { Message } from "node-nats-streaming";
import { NotFoundError, OrderCreatedEvent } from "@applinh/mcta-common";
import {BaseListener} from '@applinh/mcta-common';
import { Subjects } from "@applinh/mcta-common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../models/order.model";


// Will allow to lock a ticket if an order is being created for it
export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
    subject:Subjects.OrderCreated = Subjects.OrderCreated; // This is needed to write it like that, to lock the var to the value.
                                                                // Indeed, TicketCreatedEvent implies a subject of type Subjects.TicketCreated
                                                                // But you can also write it like that => readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;


    // onMessage callback
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
        });

        order.set({__v: data.__v});

        await order.save();
        
        msg.ack(); // Trigger acknowledge of message
    }

}