import nats, {Message} from 'node-nats-streaming';
import {randomBytes} from 'crypto';

console.clear();

// Cluster, clientID, options
// clientID must be unique
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});



stan.on("connect", () => {
    console.log('Listener connected to NATS SS !');

    stan.on('close', () => {
        console.log("NATS connection close");
        process.exit();
    });


    const options = stan.subscriptionOptions()
        .setDeliverAllAvailable() // Sync up with passed events
        .setDurableName('my-service') // Durable subscription creates a record in NATS SS so it will know and track which events have been received, and note which has been received or not
                                        // So it's a bit better than setDeliverAllAvailable, depends on your need.
        .setManualAckMode(true); // Listener has to manually acknowledge the received message / event
                                // After 30s of no ack received, the server will try to send it to another instance, or just re-send it .
    // Subscribe to a channel, and a queue group.

    // Queue groups are made so several instances of a listener don't receive several times the same message / event
    // In short, if you have two instances of one listener "A", and if you set up a queue group, the message / event will go to one instance and not the other one
    // This is really useful, because it allow to get rid off event duplication for a same listener, which would have conducted to a double-processing.
    // Ex : on event received, the listener/app push to db. With 2 instances of your listener, it would push twice to db.
    
    // setDeliverAllAvailable + setDurableName + Queue groups => BEST combo to avoid losing events (even if service goes off) and processing duplication (even with several instances)

    const subscription = stan.subscribe('ticket:created', 'ordersServiceQueueGroup', options);

    subscription.on('message', (msg: Message) => {
        console.log("Message/Event received.");

        // messageNumber in the queue
        const messageNumber = msg.getSequence();
        const data = msg.getData().toString();

        console.log("#", messageNumber);
        console.log(data);

        const {id, title, price} = JSON.parse(data);

        console.log("id: ", id);
        console.log('title: ', title);
        console.log("price: ", price);

        msg.ack(); // Trigger acknowledge of message
    });
});
// Close connection to NATS SS on signal.
// This allows to properly close the client, so NATS SS doesn't think the listener has 
// just crashed and is going to come back.
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());