import { Subjects } from "../models/subjects";

export interface TicketUpdatedEvent {
    subject: Subjects.TicketUpdated;
    data: {
        id: string;
        title: string;
        price: number;
        userId: string;
        __v: number; // OCC : The service responsible for a Create/Update/Delete on the record is the only one who updates the version number
    };
}