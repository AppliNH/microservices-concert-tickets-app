import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "../events/ticket-created.event";
import {BaseListener} from '../models/listener';
import { Subjects } from "../models/subjects";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
    subject:Subjects.TicketCreated = Subjects.TicketCreated; // This is needed to write it like that, to lock the var to the value.
                                                                // Indeed, TicketCreatedEvent implies a subject of type Subjects.TicketCreated
                                                                // But you can also write it like that => readonly subject = Subjects.TicketCreated;
    queueGroupName = "payments-service";


    // onMessage callback
    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log(`Event data : ${data}`);

        
        msg.ack(); // Trigger acknowledge of message
    }

}