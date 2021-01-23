import { Subjects } from "../models/subjects";

export interface TicketCreatedEvent {
    subject: Subjects.TicketCreated;
    data: {
        id: string;
        title: string;
        price: number;
        __v: number; // OCC : The service responsible for a Create/Update/Delete on the record is the only one who updates the version number
        userId: string;
    };
}