import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './publishers/ticket-created.publisher';

console.clear();

// Cluster, clientID, options
// clientID must be unique
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log("Publish connected to NATS Streaming server !");

    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: "123",
            title: "concert",
            price: 60
        });

    } catch(err) {
        console.error(err);
    }


 

});