import { natsWrapper } from "../../nats-wrapper";

import {ExpirationCompleteEvent, OrderStatus, TicketCreatedEvent} from '@react-node-microservices-course/common';
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";
import { ExpirationCompleteListener } from "../expiration-complete.listener";
import { Order } from "../../models/order.model";

const testSetup = async () => {
    // Creates an instance of a listener

    const listener = new ExpirationCompleteListener(natsWrapper.client);

    // Creates fake data event

    const ticket = Ticket.build({
        id:  mongoose.Types.ObjectId().toHexString(),
        price: 20,
        title: "concert"
    });

    await ticket.save();

    const order = Order.build({
        ticket: ticket,
        status: OrderStatus.Created,
        userId: mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date()
    })

    await order.save();

    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id
    };

    // Creates fake message object
    // @ts-ignore => Make typescript compiler ignore this, and forces it to compile
    const message: Message= {
        ack: jest.fn() // Will allow to invoke message.ack() via mock
    };

    return { listener, data, message, order }
};

it('emits an event that cancels the ticket', async () => {

    const { listener, data, message, order } = await testSetup();

    // Calls onMessage with the data object + message object

    await listener.onMessage(data, message);

    const fetchedOrder = await Order.findById(order.id);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(fetchedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {

    const { listener, data, message } = await testSetup();


    // Calls onMessage with the data object + message object

    await listener.onMessage(data, message);


    // Message is acknowledged

    expect(message.ack).toHaveBeenCalled();


});