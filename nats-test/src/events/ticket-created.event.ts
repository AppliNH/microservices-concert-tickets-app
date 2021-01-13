import { Subjects } from "../models/subjects";

export interface TicketCreatedEvent {
    subject: Subjects.TicketCreated;
    data: {
        id: string;
        title: string;
        price: number;
    };
}