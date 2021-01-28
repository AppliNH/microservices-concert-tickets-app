import mongoose,  { Schema, Document, Model, model } from 'mongoose';

import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

// Model(Attributes): Document

// Describes the required properties to create a new Payment
interface PaymentAttributes{
    orderId: string
    stripeId?: string;
}

// Describes the properties of a Payment document (Payment in mongo)
interface PaymentDocument extends Document {
    orderId: string
    stripeId?: string;
}

// Describes the properties of the Payment model
interface PaymentModel extends Model<PaymentDocument> {
    build(attributes: PaymentAttributes): PaymentDocument;
}


const PaymentSchema = new Schema<PaymentDocument, PaymentModel>({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: false
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

PaymentSchema.plugin(updateIfCurrentPlugin);


PaymentSchema.statics.build = (attributes: PaymentAttributes) => {
    return new Payment(attributes);
};

const Payment = model<PaymentDocument, PaymentModel>("Payment", PaymentSchema);


export { Payment }