import {connect} from 'mongoose';
import {natsWrapper} from './nats-wrapper';
import {app} from './app';
import {randomBytes} from "crypto";
import { OrderCreatedListener } from './listeners/order-created.listener';
import { OrderCancelledListener } from './listeners/order-cancelled.listener';


// startup script
const start = async() => {

    if (!process.env.JWT_KEY) {
        throw new Error("No JWT key provided. Use JWT_KEY as key, as env variable.");
    }

    if(!process.env.MONGO_URI) {
        throw new Error("No MONGO_URI provided. Use MONGO_URI as key, as env variable.");
    }

    if(!process.env.NATS_URL) {
        throw new Error("No NATS_URL provided. Use NATS_URL as key, as env variable.");
    }

    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error("No NATS_CLUSTER_ID provided. Use NATS_CLUSTER_ID as key, as env variable.");
    }

    try {
        await connect(`${process.env.MONGO_URI}/tickets`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        // Events-bus connect
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID!, process.env.NATS_URL);

        // Handling shutdowns gracefully
        natsWrapper.client.on('close', () => {
            console.log("NATS connection closed");
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        // Listeners
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();
    
    } catch(err) {
        console.error(err);
    }

    console.log("Connected to tickets-mongo !")

    app.listen(3000, () => {
        console.log("Listenin' on port 3000");
    });

};

start();