import { Message } from "node-nats-streaming";
import { NotFoundError, OrderCreatedEvent } from "@react-node-microservices-course/common";
import {BaseListener} from '@react-node-microservices-course/common';
import { Subjects } from "@react-node-microservices-course/common";
import { queueGroupName } from "./queue-group-name";

// Will allow to lock a ticket if an order is being created for it
export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
    subject:Subjects.OrderCreated = Subjects.OrderCreated; // This is needed to write it like that, to lock the var to the value.
                                                                // Indeed, TicketCreatedEvent implies a subject of type Subjects.TicketCreated
                                                                // But you can also write it like that => readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;


    // onMessage callback
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        
        
        msg.ack(); // Trigger acknowledge of message
    }

}