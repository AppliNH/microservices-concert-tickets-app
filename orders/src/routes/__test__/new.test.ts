// Test-first approach

import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';
import { generateJWTcookieSession } from '../../test/auth-helper';
import mongoose from 'mongoose';
import { Order } from '../../models/order.model';
import { OrderStatus } from '@react-node-microservices-course/common';

it('returns a 404 if ticket does not exist', async () => {
    const jwt = generateJWTcookieSession();


    const response = await request(app)
        .post('/api/orders')
        .set('Cookie',jwt )
        .send({
            ticketId: mongoose.Types.ObjectId()
        });

    expect(response.status).toEqual(404);
});

it('returns an error if ticket is already reserved', async () => {

    const jwt = generateJWTcookieSession();

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 50
    });

    await ticket.save();

    const order = Order.build({
        ticket,
        userId: "123a123a31",
        status: OrderStatus.Created,
        expiresAt: new Date()
    });

    await order.save();
    
    await request(app)
        .post('/api/orders')
        .set('Cookie',jwt )
        .send({
            ticketId: ticket.id
        })
        .expect(400);

});

it('reserves a ticket', async () => {

    const jwt = generateJWTcookieSession();


    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 50
    });

    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie',jwt )
        .send({
            ticketId:ticket.id
        })
        .expect(201);
    
});

it('it emits an order created event', async() => {
    const jwt = generateJWTcookieSession();


    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 50
    });

    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie',jwt )
        .send({
            ticketId:ticket.id
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
