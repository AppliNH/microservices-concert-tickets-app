import nats from 'node-nats-streaming';

console.clear();

// Cluster, clientID, options
// clientID must be unique
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log("Publish connected to NATS Streaming server !");

    // Must be stringified to be shared over the NATS SS
    const data = JSON.stringify({
        id: "123",
        title: "concert",
        price: 60
    });

    // Channel name(or event type), data (also called message), callback
    stan.publish('ticket:created', data, () => {
        console.log("Event published")
    });

});