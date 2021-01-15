import { rejects } from "assert";
import { Stan } from "node-nats-streaming";
import { Event } from "./event";

export abstract class BasePublisher<T extends Event> {
    abstract subject: T['subject'];// Channel name(or event type)
    

    constructor(private client: Stan) {
        this.client = client;
    }

    publish(data: T["data"]): Promise<void> {
    // Data/event must be stringified to be shared over the NATS SS
        return new Promise<void>((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {

                if (err) {
                    return reject(err);
                }

                console.log("Event published");
                
                resolve();

            });
        });

        
    }
}