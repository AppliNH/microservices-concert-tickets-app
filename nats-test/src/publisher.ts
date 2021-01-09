import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});
