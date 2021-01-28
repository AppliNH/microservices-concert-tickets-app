import { OrderCreatedListener } from './listeners/order-created.listener';
import {natsWrapper} from './nats-wrapper';



// startup script
const start = async() => {

    if(!process.env.NATS_URL) {
        throw new Error("No NATS_URL provided. Use NATS_URL as key, as env variable.");
    }

    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error("No NATS_CLUSTER_ID provided. Use NATS_CLUSTER_ID as key, as env variable.");
    }

    if(!process.env.REDIS_HOST) {
        throw new Error("No REDIS_HOST provided. Use REDIS_HOST as key, as env variable.");
    }

    try {

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
        
    
    } catch(err) {
        console.error(err);
    }


};

start();