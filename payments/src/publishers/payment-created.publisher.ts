import { PaymentCreatedEvent } from "@react-node-microservices-course/common";
import { BasePublisher } from "@react-node-microservices-course/common";
import { Subjects } from "@react-node-microservices-course/common";

export class PaymentCreatedPublisher extends BasePublisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}