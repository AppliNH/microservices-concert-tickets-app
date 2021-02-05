import { ExpirationCompleteEvent } from "@applinh/mcta-common";
import { BasePublisher } from "@applinh/mcta-common";
import { Subjects } from "@applinh/mcta-common";

export class ExpirationCompletePublisher extends BasePublisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}