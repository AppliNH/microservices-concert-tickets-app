import { OrderCreatedEvent, OrderStatus } from "@react-node-microservices-course/common";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCreatedListener } from "../order-created.listener";
import mongoose from "mongoose";
import { Order } from "../../models/order.model";


const testSetup = async () => {
    // Creates an instance of a listener

    const listener = new OrderCreatedListener(natsWrapper.client);


    // Creates fake data event
    const data: OrderCreatedEvent["data"] = {
        id: mongoose.Types.ObjectId().toHexString(),
        ticket: {
            id: mongoose.Types.ObjectId().toHexString(),
            price: 15
        },
        __v: 0,
        status: OrderStatus.Created,
        expiresAt: new Date().toISOString(),
        userId: mongoose.Types.ObjectId().toHexString(),
    };

    // Creates fake message object
    // @ts-ignore => Make typescript compiler ignore this, and forces it to compile
    const message: Message= {
        ack: jest.fn() // Will allow to invoke message.ack() via mock
    };

    return { listener, data, message}
};

it("saves up the order in db", async() => {
    const  { listener, data, message } = await testSetup();

    await listener.onMessage(data, message);

    const fetchedOrder = await Order.findById(data.id);

    expect(fetchedOrder?.id).toEqual(data.id);
});


it('acks the message', async () => {

    const { listener, data, message } = await testSetup();


    // Calls onMessage with the data object + message object

    await listener.onMessage(data, message);


    // Message is acknowledged

    expect(message.ack).toHaveBeenCalled();


});