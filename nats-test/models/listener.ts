import { Message, Stan } from "node-nats-streaming";

export default abstract class Listener {

    abstract subject: string
    abstract queueGroupName: string;
    private client: Stan;
    protected ackWait: number = 5*1000; // 5s
    abstract onMessage(data: string, msg: Message): void;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client.subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }


    
    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
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