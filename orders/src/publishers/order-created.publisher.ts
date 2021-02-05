import { OrderCreatedEvent } from "@applinh/mcta-common";
import { BasePublisher } from "@applinh/mcta-common";
import { Subjects } from "@applinh/mcta-common";

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}