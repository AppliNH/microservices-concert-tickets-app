import { response } from 'express';
import request from 'supertest';
import {app} from "../../app";
import { generateJWTcookieSession } from '../../test/auth-helper';
import mongoose from 'mongoose';


it('returns a 404 if the ticket is not found', async () => {
    const randomId = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${randomId}`)
        .send()
        .expect(404);
});

it('returns the ticket if the ticket is found', async () => {

    const title = "yeh"
    const price = 30;
    const jwt = generateJWTcookieSession();

    const response = await request(app)
        .post('/api/tickets')
        .set("Cookie", jwt)
        .send({
            title, price
        })
        .expect(201);


    const ticketId = response.body.id;
    
    const ticketResponse = await request(app)
        .get (`/api/tickets/${ticketId}`)
        .send()
        .expect(200);

        expect(ticketResponse.body.title).toEqual(title);
        expect(ticketResponse.body.price).toEqual(price);
    
});