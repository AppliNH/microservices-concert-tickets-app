import { OrderStatus } from "../../types/order-status";
import { Subjects } from "../models/subjects";


export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        id: string;
        ticket: {id: string};
    };
}