import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@react-node-microservices-course/common";
import {BaseListener} from '@react-node-microservices-course/common';
import { Subjects } from "@react-node-microservices-course/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../models/ticket.model";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
    subject:Subjects.TicketCreated = Subjects.TicketCreated; // This is needed to write it like that, to lock the var to the value.
                                                                // Indeed, TicketCreatedEvent implies a subject of type Subjects.TicketCreated
                                                                // But you can also write it like that => readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;


    // onMessage callback
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const {id, title, price } = data;

        const ticket = Ticket.build({
            id, title, price
        });

        await ticket.save();

        
        msg.ack(); // Trigger acknowledge of message
    }

}