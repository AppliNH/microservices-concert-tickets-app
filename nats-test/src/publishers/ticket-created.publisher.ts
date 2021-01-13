import { TicketCreatedEvent } from "../events/ticket-created.event";
import { BasePublisher } from "../models/publisher";
import { Subjects } from "../models/subjects";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}