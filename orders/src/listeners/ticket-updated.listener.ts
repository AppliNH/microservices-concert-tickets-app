import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@applinh/mcta-common";
import {BaseListener} from '@applinh/mcta-common';
import { Subjects } from "@applinh/mcta-common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../models/ticket.model";

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
    subject:Subjects.TicketUpdated = Subjects.TicketUpdated; // This is needed to write it like that, to lock the var to the value.
                                                                // Indeed, TicketUpdatedEvent implies a subject of type Subjects.TicketUpdated
                                                                // But you can also write it like that => readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;


    // onMessage callback
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        
        
        const ticket = await Ticket.findByIdAndPrevVersion(data);

        if (!ticket) {
            throw new Error(`Ticket ${data.id} Not Found !!`)
        }

        const { title, price } = data;

        ticket.set({title, price});

        await ticket.save();

        msg.ack(); // Trigger acknowledge of message
    }

}