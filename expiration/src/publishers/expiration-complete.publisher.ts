import { ExpirationCompleteEvent } from "@react-node-microservices-course/common";
import { BasePublisher } from "@react-node-microservices-course/common";
import { Subjects } from "@react-node-microservices-course/common";

export class ExpirationCompletePublisher extends BasePublisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}