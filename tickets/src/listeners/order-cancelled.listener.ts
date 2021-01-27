import { Message } from "node-nats-streaming";
import { NotFoundError, OrderCancelledEvent } from "@react-node-microservices-course/common";
import {BaseListener} from '@react-node-microservices-course/common';
import { Subjects } from "@react-node-microservices-course/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../models/ticket.model";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher";

// Will allow to lock a ticket if an order is being Cancelled for it
export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
    subject:Subjects.OrderCancelled = Subjects.OrderCancelled; // This is needed to write it like that, to lock the var to the value.
                                                                // Indeed, TicketCancelledEvent implies a subject of type Subjects.TicketCancelled
                                                                // But you can also write it like that => readonly subject = Subjects.TicketCancelled;
    queueGroupName = queueGroupName;


    // onMessage callback
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // Will remove orderId from ticket to show it's not reserved anymore

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new NotFoundError();
        }

        // Unset attached orderId on tickets
        ticket.set({orderId : undefined});

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