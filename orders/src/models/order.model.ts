import mongoose,  { Schema, Document, Model, model } from 'mongoose';
import {OrderStatus} from '@react-node-microservices-course/common';

// Model(Attributes): Document

// Describes the required properties to create a new order
interface OrderAttributes{
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: any;
}

// Describes the properties of a order document (order in mongo)
interface OrderDocument extends Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: any;
}

// Describes the properties of the order model
interface OrderModel extends Model<OrderDocument> {
    build(attributes: OrderAttributes): OrderDocument;
}


const orderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus), // Mandatory for enums
        // default: OrderStatus.Created => default value (not mandatory)
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
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


orderSchema.statics.build = (attributes: OrderAttributes) => {
    return new Order(attributes);
};

const Order = model<OrderDocument, OrderModel>("Order", orderSchema);


export { Order }