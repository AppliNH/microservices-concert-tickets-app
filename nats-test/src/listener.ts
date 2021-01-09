import nats, {Message} from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', '123', {
    url: 'http://localhost:4222'
});



stan.on("connect", () => {
    console.log('Listener connected to NATS SS !');

    // Subscribe to a channel.
    const subscription = stan.subscribe('ticket:created');

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
    });
});