import { OrderCancelledEvent, OrderStatus } from "@react-node-microservices-course/common";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled.listener";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket.model";

const testSetup = async () => {
    // Creates an instance of a listener

    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = mongoose.Types.ObjectId().toHexString();

    // Creates and saves ticket
    const ticket = Ticket.build({
        title:"concert",
        price: 20,
        userId: '20A',
        
    });
    ticket.set({orderId})

    await ticket.save();

    // Creates fake data event
    const data: OrderCancelledEvent["data"] = {
        id: mongoose.Types.ObjectId().toHexString(),
        ticket: {
            id: ticket.id,
        },
        __v: 0,
    };

    // Creates fake message object
    // @ts-ignore => Make typescript compiler ignore this, and forces it to compile
    const message: Message= {
        ack: jest.fn() // Will allow to invoke message.ack() via mock
    };

    return { listener, data, message, ticket, orderId }
};

it("updates the ticket, publishes an event", async() => {
    const  { listener, data, message, ticket } = await testSetup();

    await listener.onMessage(data, message);

    const reservedTicket = await Ticket.findById(ticket.id);

    expect(reservedTicket!.orderId).not.toBeDefined();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});


it('acks the message', async () => {

    const { listener, data, message } = await testSetup();


    // Calls onMessage with the data object + message object

    await listener.onMessage(data, message);


    // Message is acknowledged

    expect(message.ack).toHaveBeenCalled();


});