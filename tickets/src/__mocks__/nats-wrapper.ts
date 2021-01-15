import { Stan } from "node-nats-streaming";

// Mocks the natsWrapper directly with the publish command, that just calls the provided callback. 
export const natsWrapper = {
    client: {
        publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
            callback();
        }) 
    }
};