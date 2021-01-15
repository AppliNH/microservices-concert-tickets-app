import {connect} from 'mongoose';
import {natsWrapper} from './nats-wrapper';
import {app} from './app';
import {randomBytes} from "crypto";


// startup script
const start = async() => {

    if (!process.env.JWT_KEY) {
        throw new Error("No JWT key provided. Use JWT_KEY as key, as env variable.");
    }

    if(!process.env.MONGO_URI) {
        throw new Error("No MONGO_URI provided. Use MONGO_URI as key, as env variable.");
    }

    try {
        await connect(`${process.env.MONGO_URI}/tickets`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        // Events-bus connect
        await natsWrapper.connect("ticketing", randomBytes(4).toString('hex'), "http://nats-service:4222");

        // Handling shutdowns gracefully
        natsWrapper.client.on('close', () => {
            console.log("NATS connection closed");
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());
    
    } catch(err) {
        console.error(err);
    }

    console.log("Connected to tickets-mongo !")

    app.listen(3000, () => {
        console.log("Listenin' on port 3000");
    });

};

start();