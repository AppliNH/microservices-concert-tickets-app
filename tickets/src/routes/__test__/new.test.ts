// Test-first approach

import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';
import { generateJWTcookieSession } from '../../test/auth-helper';


it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be acccessed if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).toEqual(401);

    

    const response2 = await request(app)
        .post('/api/tickets')
        .set('Cookie', generateJWTcookieSession())
        .send({});

    expect(response2.status).not.toEqual(401);

});

it('returns an error if an invalid title is provided', async () => {

    await request(app)
        .post('/api/tickets')
        .set('Cookie', generateJWTcookieSession())
        .send({
            title: "",
            price: 20
        })
        .expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie', generateJWTcookieSession())
    .send({
        price: 20
    })
    .expect(400);

    

    
});

it('returns an error if an invalid price is provided', async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', generateJWTcookieSession())
    .send({
        title: 'boi'
    })
    .expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie', generateJWTcookieSession())
    .send({
        title: 'boi',
        price: -8
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {

    // Get all tickets
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', generateJWTcookieSession())
        .send({
            title: "boi",
            price: 20
        })
        .expect(201);
    
    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1);

    expect(tickets[0].title).toEqual('boi');
    expect(tickets[0].price).toEqual(20);

});

it("published an event", async () => {

    await request(app)
        .post('/api/tickets')
        .set('Cookie', generateJWTcookieSession())
        .send({
            title: "boi",
            price: 20
        })
        .expect(201);
    
    // Regular natsWrapper, but is replaced with the mock in test/setup.ts
    expect(natsWrapper.client.publish).toHaveBeenCalled();

});