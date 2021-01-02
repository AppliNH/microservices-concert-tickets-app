import  { Schema, Document, Model, model } from 'mongoose';
import { Password } from '../utils/password';

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


const userSchema = new Schema({
    email: {
        type: String, // Capital S cause refering to the constructor String
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Middleware on saving to db
userSchema.pre("save", async function(done) {
    if(this.isModified('password')) {
        // Hashing the password before saving to db
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attributes: UserAttributes) => {
    return new User(attributes);
};

const User = model<UserDocument, UserModel>("User", userSchema);


export { User }