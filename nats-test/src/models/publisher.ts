import { Stan } from "node-nats-streaming";
import { Event } from "./event";

export abstract class BasePublisher<T extends Event> {
    abstract subject: T['subject'];// Channel name(or event type)
    

    constructor(private client: Stan) {
        this.client = client;
    }

    publish(data: T["data"]) {
    // Data/event must be stringified to be shared over the NATS SS
            

        this.client.publish(this.subject, JSON.stringify(data), () => {
            console.log("Event published")
        });
    }
}