import { OrderStatus } from "../../types/order-status";
import { Subjects } from "../models/subjects";

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        id: string;
        __v: number; // OCC : The service responsible for a Create/Update/Delete on the record is the only one who updates the version number
        ticket: {id: string};
    };
}