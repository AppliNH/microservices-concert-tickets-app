import { OrderStatus } from '@applinh/mcta-common';
import  { Schema, Document, Model, model } from 'mongoose';
import { Order } from './order.model';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';


// Model(Attributes): Document

// Describes the required properties to create a new ticket
interface TicketAttributes{
    id: string
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
    findByIdAndPrevVersion(event: { id: string, __v: number }): Promise<TicketDocument | null >;
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

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByIdAndPrevVersion = (event: { id: string, __v: number }) => {
    return Ticket.findOne({
        _id: event.id,
        __v: event.__v -1
    });
};

ticketSchema.statics.build = (attributes: TicketAttributes) => {
    return new Ticket({
        _id: attributes.id, // _id is mongoid
        title: attributes.title,
        price: attributes.price
    });
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