import { TicketCreatedEvent } from "@applinh/mcta-common";
import { BasePublisher } from "@applinh/mcta-common";
import { Subjects } from "@applinh/mcta-common";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}