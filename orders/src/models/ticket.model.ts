import { OrderStatus } from '@react-node-microservices-course/common';
import  { Schema, Document, Model, model } from 'mongoose';
import { Order } from './order.model';


// Model(Attributes): Document

// Describes the required properties to create a new ticket
interface TicketAttributes{
    title: string;
    price: number;
}

// Describes the properties of a ticket document (ticket in mongo)
interface TicketDocument extends Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

// Describes the properties of the ticket model
interface TicketModel extends Model<TicketDocument> {
    build(attributes: TicketAttributes): TicketDocument;
}


const ticketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
},
{
    toJSON:{ // Overwrites (or overloads) toJSON function used by mongoose when it comes to turn the data into JSON (for response)
        transform(doc, ret) { // doc is the initial document, ret is the output
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});


ticketSchema.statics.build = (attributes: TicketAttributes) => {
    return new Ticket(attributes);
};

ticketSchema.methods.isReserved = async function() {
    const existingOrderWithTicket = await Order.findOne({
        ticket: this, 
        status: {
            $ne: OrderStatus.Cancelled // Not Equal to status cancelled (so this mean that the order is still active)
        }})
    return !!existingOrderWithTicket; // if existingOrderWithTicket is defined, will return true
}

const Ticket = model<TicketDocument, TicketModel>("Ticket", ticketSchema);


export { Ticket, TicketDocument }