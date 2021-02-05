import { OrderCreatedEvent, OrderStatus } from "@applinh/mcta-common";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCreatedListener } from "../order-created.listener";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket.model";

const testSetup = async () => {
    // Creates an instance of a listener

    const listener = new OrderCreatedListener(natsWrapper.client);


    // Creates and saves ticket
    const ticket = Ticket.build({
        title:"concert",
        price: 20,
        userId: '20A'
    });

    await ticket.save();

    // Creates fake data event
    const data: OrderCreatedEvent["data"] = {
        id: mongoose.Types.ObjectId().toHexString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
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

    return { listener, data, message, ticket }
};

it("locks a ticket by setting the orderId on it", async() => {
    const  { listener, data, message, ticket } = await testSetup();

    await listener.onMessage(data, message);

    const reservedTicket = await Ticket.findById(ticket.id);

    expect(reservedTicket?.orderId).toBeDefined();
    expect(reservedTicket?.orderId).toEqual(data.id);
});


it('acks the message', async () => {

    const { listener, data, message } = await testSetup();


    // Calls onMessage with the data object + message object

    await listener.onMessage(data, message);


    // Message is acknowledged

    expect(message.ack).toHaveBeenCalled();


});

it("publishes a ticket updated event", async () => {

    const { listener, data, message, ticket } = await testSetup();

    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const updatedTicket = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(updatedTicket.orderId).toEqual(data.id);
});