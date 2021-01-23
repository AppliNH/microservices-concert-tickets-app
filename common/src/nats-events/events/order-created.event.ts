import { OrderStatus } from "../../types/order-status";
import { Subjects } from "../models/subjects";


export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        ticket: {id: string, price: number};
        userId: string;
        __v: number; // OCC : The service responsible for a Create/Update/Delete on the record is the only one who updates the version number
        status: OrderStatus;
        expiresAt: string; // This whole object will be exported to JSON, so it's better to see the date as a string
    };
}