import nats, {Message, Stan} from 'node-nats-streaming';
import {randomBytes} from 'crypto';
import Listener from '../models/listener';

class TicketCreatedListener extends Listener {
    subject = "ticket:created";
    queueGroupName = "payments-service";


    // onMessage callback
    onMessage(data: string, msg: Message) {
        console.log(`Event data : ${data}`);
        msg.ack(); // Trigger acknowledge of message
    }

}

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

    new TicketCreatedListener(stan).listen();

});


// Close connection to NATS SS on signal.
// This allows to properly close the client, so NATS SS doesn't think the listener has 
// just crashed and is going to come back.
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

// ---



