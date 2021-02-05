import { natsWrapper } from "../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created.listener";
import {TicketCreatedEvent} from '@applinh/mcta-common';
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";

const testSetup = async () => {
    // Creates an instance of a listener

    const listener = new TicketCreatedListener(natsWrapper.client);

    // Creates fake data event

    const data: TicketCreatedEvent["data"] = {
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 15,
        __v: 0,
        userId: mongoose.Types.ObjectId().toHexString(),
    };

    // Creates fake message object
    // @ts-ignore => Make typescript compiler ignore this, and forces it to compile
    const message: Message= {
        ack: jest.fn() // Will allow to invoke message.ack() via mock
    };

    return { listener, data, message }
};

it('creates and saves a ticket', async () => {

    const { listener, data, message } = await testSetup();

    // Calls onMessage with the data object + message object

    await listener.onMessage(data, message);

    // Ticket must be created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {

    const { listener, data, message } = await testSetup();


    // Calls onMessage with the data object + message object

    await listener.onMessage(data, message);


    // Message is acknowledged

    expect(message.ack).toHaveBeenCalled();


});