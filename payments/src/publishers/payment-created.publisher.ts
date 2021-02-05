import { PaymentCreatedEvent } from "@applinh/mcta-common";
import { BasePublisher } from "@applinh/mcta-common";
import { Subjects } from "@applinh/mcta-common";

export class PaymentCreatedPublisher extends BasePublisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}