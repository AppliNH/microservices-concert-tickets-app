import mongoose from 'mongoose';

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

const User = mongoose.model("User", userSchema);

export { User }