import { natsWrapper } from "../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated.listener";
import {TicketUpdatedEvent} from '@react-node-microservices-course/common';
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";

const testSetup = async () => {
    // Creates an instance of a listener

    const listener = new TicketUpdatedListener(natsWrapper.client);

    // Create and save a ticket

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 70
    });
    
    await ticket.save();

    // Creates fake data event

    const data: TicketUpdatedEvent["data"] = {
        id: ticket.id,
        title: 'concert',
        price: 78,
        __v: ticket.__v! + 1,
        userId: mongoose.Types.ObjectId().toHexString(),
    };

    // Creates fake message object
    // @ts-ignore => Make typescript compiler ignore this, and forces it to compile
    const message: Message= {
        ack: jest.fn() // Will allow to invoke message.ack() via mock
    };

    return { listener, data, message, ticket }
};

it('finds, updates, and saves a ticket', async () => {

    const { listener, data, message, ticket } = await testSetup();

    // Calls onMessage with the data object + message object

    await listener.onMessage(data, message);

    // Ticket must be updated
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.__v).toEqual(data.__v);
});

it('doesnt call ack if the event has a skipped version number', async () => {

    // here __v = 1
    const { listener, data, message, ticket } = await testSetup();

    // skipping to version 150
    data.__v = 150;

    // Will fail
    try {
        await listener.onMessage(data, message);
    } catch(err) {

    }
    
    // Message ack not called cause exception occured
    expect(message.ack).not.toHaveBeenCalled();

});

it('acks the message', async () => {

    const { listener, data, message } = await testSetup();


    // Calls onMessage with the data object + message object

    await listener.onMessage(data, message);


    // Message is acknowledged

    expect(message.ack).toHaveBeenCalled();


});