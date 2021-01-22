import { OrderCancelledEvent } from "@react-node-microservices-course/common";
import { BasePublisher } from "@react-node-microservices-course/common";
import { Subjects } from "@react-node-microservices-course/common";

export class OrderCancelledPublisher extends BasePublisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}