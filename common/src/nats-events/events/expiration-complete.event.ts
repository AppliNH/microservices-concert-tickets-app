import { Subjects } from "../models/subjects";

export interface ExpirationCompleteEvent {
    subject: Subjects.ExpirationComplete;
    data: {
        orderId: string;
    };
}