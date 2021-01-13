import { Message, Stan } from "node-nats-streaming";

export default abstract class Listener {

    abstract subject: string
    abstract queueGroupName: string;
    private client: Stan;
    protected ackWait: number = 5*1000; // 5s
    abstract onMessage(data: string, msg: Message): void; // onMessage callback

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client.subscriptionOptions()
            .setDeliverAllAvailable()   // Sync up with passed events
            .setManualAckMode(true)     // Listener has to manually acknowledge the received message / event
            .setAckWait(this.ackWait)    // After this.ackWait seconds of no ack received, the server will try to send it to another instance, or just re-send it .
            .setDurableName(this.queueGroupName);// Durable subscription creates a record in NATS SS so it will know and track which events have been received, and note which has been received or not
                                                    // So it's a bit better than setDeliverAllAvailable, depends on your need.
    }

    listen() {
        
        // Subscribe to a channel, and a queue group.

        // Queue groups are made so several instances of a listener don't receive several times the same message / event
        // In short, if you have two instances of one listener "A", and if you set up a queue group, the message / event will go to one instance and not the other one
        // This is really useful, because it allow to get rid off event duplication for a same listener, which would have conducted to a double-processing.
        // Ex : on event received, the listener/app push to db. With 2 instances of your listener, it would push twice to db.
        
        // setDeliverAllAvailable + setDurableName + Queue groups => BEST combo to avoid losing events (even if service goes off) and processing duplication (even with several instances)
        
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        

        subscription.on('message', (msg: Message) => {
            
            //  // messageNumber in the queue
            // const messageNumber = msg.getSequence();
            
            console.log(
                `Message received: ${this.subject} / ${this.queueGroupName}`
            );
            
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);

        
        });   
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string' ?
            JSON.parse(data)
        :
            JSON.parse(data.toString('utf8'));
            
    }

}