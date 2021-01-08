import { response } from 'express';
import request from 'supertest';
import {app} from "../../app";
import { generateJWTcookieSession } from '../../test/auth-helper';
import mongoose from 'mongoose';



it('returns a 404 if id doesnt exist', async () => {
    
    const randomId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${randomId}`)
        .set('Cookie', generateJWTcookieSession())
        .send({
            title:"new title",
            price:20
        }).expect(404);
});


it('returns a 401 if the user is not auth', async () => {

    const randomId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${randomId}`)
        .send({
            title:"new title",
            price:20
        }).expect(401);

});


it('returns a 401 if the user doesnt own the ticket', async () => {
    const jwt = generateJWTcookieSession();
    const title = "boi";
    const price = 42;

    const response1 = await request(app)
        .post('/api/tickets')
        .set("Cookie", jwt)
        .send({
            title, price
        })
    const { id } = response1.body;

    const jwt2 = generateJWTcookieSession();

    await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", jwt2)
    .send({
        title, price
    })
    .expect(401);

});


it('returns a 400 if the user provides a wrong title or price', async () => {

    const jwt = generateJWTcookieSession();
    const title = "boi";
    const price = 42;

    const response1 = await request(app)
        .post('/api/tickets')
        .set("Cookie", jwt)
        .send({
            title, price
        })
    const { id } = response1.body;

    await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", jwt)
    .send({
        title:"", 
        price: -9
    })
    .expect(400);
    
});

it('updates the tickets if valid inputs', async () => {

    const jwt = generateJWTcookieSession();
    const title = "boi";
    const price = 42;

    const response1 = await request(app)
        .post('/api/tickets')
        .set("Cookie", jwt)
        .send({
            title, price
        })
    const { id } = response1.body;

    await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", jwt)
    .send({
        title:"hey", 
        price: 40
    })
    .expect(200);

    const ticketResponse = await request(app)
    .get (`/api/tickets/${id}`)
    .send()
    .expect(200);

    expect(ticketResponse.body.title).toEqual("hey");
    expect(ticketResponse.body.price).toEqual(40);

});