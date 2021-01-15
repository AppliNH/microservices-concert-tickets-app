import { TicketCreatedEvent } from "@react-node-microservices-course/common";
import { BasePublisher } from "@react-node-microservices-course/common";
import { Subjects } from "@react-node-microservices-course/common";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}