import { Message } from "node-nats-streaming";
import { NotFoundError, OrderCreatedEvent } from "@react-node-microservices-course/common";
import {BaseListener} from '@react-node-microservices-course/common';
import { Subjects } from "@react-node-microservices-course/common";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../queues/expiration.queue";

// Will allow to lock a ticket if an order is being created for it
export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
    subject:Subjects.OrderCreated = Subjects.OrderCreated; // This is needed to write it like that, to lock the var to the value.
                                                                // Indeed, TicketCreatedEvent implies a subject of type Subjects.TicketCreated
                                                                // But you can also write it like that => readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;


    // onMessage callback
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log("Waiting "+delay+" to process job")

        // publish job to queue
        await expirationQueue.add(
            {orderId: data.id},
            {
                delay
            }
            );
        
        msg.ack(); // Trigger acknowledge of message
    }

}