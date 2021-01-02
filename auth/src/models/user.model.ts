import mongoose,  { Schema, Document, Model } from 'mongoose';

// Model(Attributes): Document

// Describes the required properties to create a new user
interface UserAttributes{
    email: string;
    password: string;
}

// Describes the properties of a user document (user in mongo)
interface UserDocument extends Document {
    email: string;
    password: string;
}

// Describes the properties of the user model
interface UserModel extends Model<UserDocument> {
    build(attributes: UserAttributes): UserDocument;
}


const userSchema = new mongoose.Schema({
    email: {
        type: String, // Capital S cause refering to the constructor String
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.statics.build = (attributes: UserAttributes) => {
    return new User(attributes);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);


export { User }