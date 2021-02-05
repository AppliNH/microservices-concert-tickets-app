import { Message } from "node-nats-streaming";
import { NotFoundError, OrderCreatedEvent } from "@applinh/mcta-common";
import {BaseListener} from '@applinh/mcta-common';
import { Subjects } from "@applinh/mcta-common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../models/ticket.model";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher";

// Will allow to lock a ticket if an order is being created for it
export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
    subject:Subjects.OrderCreated = Subjects.OrderCreated; // This is needed to write it like that, to lock the var to the value.
                                                                // Indeed, TicketCreatedEvent implies a subject of type Subjects.TicketCreated
                                                                // But you can also write it like that => readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;


    // onMessage callback
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // Will store orderId on ticket to show by which order it is reserved

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new NotFoundError();
        }

        ticket.set({orderId : data.id});

        await ticket.save();
        // Dispatch the updated ticket, with the orderId assigned on it
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            __v: ticket.__v!,
            orderId: ticket.orderId
        });
        
        msg.ack(); // Trigger acknowledge of message
    }

}