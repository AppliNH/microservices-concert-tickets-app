import { OrderCancelledEvent, OrderStatus } from "@applinh/mcta-common";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled.listener";
import mongoose from "mongoose";
import { Order } from "../../models/order.model";

const testSetup = async () => {
    // Creates an instance of a listener

    const listener = new OrderCancelledListener(natsWrapper.client);



    // Creates fake data event

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price:20,
        status: OrderStatus.Created,
        userId: "123A"
    });

    await order.save();

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        ticket: {
            id: mongoose.Types.ObjectId().toHexString(),
        },
        __v: 1,
    };

    // Creates fake message object
    // @ts-ignore => Make typescript compiler ignore this, and forces it to compile
    const message: Message= {
        ack: jest.fn() // Will allow to invoke message.ack() via mock
    };

    return { listener, data, message }
};

it("updates the order status", async() => {
    const  { listener, data, message } = await testSetup();

    await listener.onMessage(data, message);

    const fetchedOrder = await Order.findById(data.id);

    expect(fetchedOrder!.id).toEqual(data.id);
    expect(fetchedOrder!.status).toEqual(OrderStatus.Cancelled)
});


it('acks the message', async () => {

    const { listener, data, message } = await testSetup();


    // Calls onMessage with the data object + message object

    await listener.onMessage(data, message);


    // Message is acknowledged

    expect(message.ack).toHaveBeenCalled();


});