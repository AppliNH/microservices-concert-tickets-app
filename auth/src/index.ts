import mongoose, {connect} from 'mongoose';
import {app} from './app';


// startup script
const start = async() => {
    console.log("Starting auth...")
    if (!process.env.JWT_KEY) {
        throw new Error("No JWT key provided. Use JWT_KEY as key, as env variable.");
    }

    if(!process.env.MONGO_URI) {
        throw new Error("No MONGO_URI provided. Use MONGO_URI as key, as env variable.");
    }

    try {
        await mongoose.connect(`${process.env.MONGO_URI}/auth`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

    } catch(err) {
        console.error(err);
    }

    console.log("Conencted to auth-mongo !")

    app.listen(3000, () => {
        console.log("Listenin' on port 3000");
    });

};

start();