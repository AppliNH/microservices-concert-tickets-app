import  { Schema, Document, Model, model } from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

// Model(Attributes): Document

// Describes the required properties to create a new ticket
interface TicketAttributes{
    title: string;
    price: number;
    userId: string;
}

// Describes the properties of a ticket document (ticket in mongo)
interface TicketDocument extends Document {
    title: string;
    price: number;
    userId: string;
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
    },
    userId: {
        type: String,
        required: true
    },
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

// Middleware on saving to db

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attributes: TicketAttributes) => {
    return new Ticket(attributes);
};

const Ticket = model<TicketDocument, TicketModel>("Ticket", ticketSchema);


export { Ticket }