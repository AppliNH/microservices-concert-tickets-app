import Queue from "bull";
import { natsWrapper } from "../nats-wrapper";
import { ExpirationCompletePublisher } from "../publishers/expiration-complete.publisher";

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST
    }
});


expirationQueue.process(async (job) => {

    console.log("Will publish exp for ", job.data.orderId);

    await new ExpirationCompletePublisher(natsWrapper.client).publish(
        {
            orderId: job.data.orderId
        }
    );
    

});


export {expirationQueue};