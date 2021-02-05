import { TicketCreatedEvent, TicketUpdatedEvent } from "@applinh/mcta-common";
import { BasePublisher } from "@applinh/mcta-common";
import { Subjects } from "@applinh/mcta-common";

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}