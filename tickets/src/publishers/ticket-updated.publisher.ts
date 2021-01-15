import { TicketCreatedEvent, TicketUpdatedEvent } from "@react-node-microservices-course/common";
import { BasePublisher } from "@react-node-microservices-course/common";
import { Subjects } from "@react-node-microservices-course/common";

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}