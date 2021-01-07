import { response } from 'express';
import request from 'supertest';
import {app} from "../../app";
import { generateJWTcookieSession } from '../../test/auth-helper';
import mongoose from 'mongoose';

const createTicket = (title: string, price: number, jwt: string[]) => {

    return request(app)
        .post('/api/tickets')
        .set("Cookie", jwt)
        .send({
            title, price
        })

}

it('returns tickets', async () => {
    const jwt = generateJWTcookieSession();
    let sentTickets = []
    sentTickets.push((await createTicket("yeh", 30, jwt)).body);
    sentTickets.push((await createTicket("yeh2", 20, jwt)).body);
    
    
    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2);


});
