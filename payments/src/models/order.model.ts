import mongoose,  { Schema, Document, Model, model } from 'mongoose';
import {OrderStatus} from '@applinh/mcta-common';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

// Model(Attributes): Document

// Describes the required properties to create a new order
interface OrderAttributes{
    id: string;
    userId: string;
    status: OrderStatus;
    price: number;
}

// Describes the properties of a order document (order in mongo)
interface OrderDocument extends Document {
    userId: string;
    status: OrderStatus;
    price: number;
}

// Describes the properties of the order model
interface OrderModel extends Model<OrderDocument> {
    build(attributes: OrderAttributes): OrderDocument;
}


const orderSchema = new Schema<OrderDocument, OrderModel>({
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

orderSchema.plugin(updateIfCurrentPlugin);


orderSchema.statics.build = (attributes: OrderAttributes) => {
    return new Order({
        _id: attributes.id,
        price: attributes.price,
        status: attributes.status,
        userId: attributes.userId
    });
};

const Order = model<OrderDocument, OrderModel>("Order", orderSchema);


export { Order }