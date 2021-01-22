import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order.model';
import { Ticket } from '../../models/ticket.model';
import { generateJWTcookieSession } from '../../test/auth-helper';


it('fetches the order of an user', async () => {

    const jwt1 = generateJWTcookieSession();

    const ticket = Ticket.build({
        title:"concert",
        price: 20
    });

    await ticket.save();

    const response  = await request(app)
        .post('/api/orders')
        .set("Cookie", jwt1)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    

    const orderId = response.body.id
        
    const responseGet = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Cookie", jwt1)
        .expect(200);
    

    expect(responseGet.body.id).toEqual(orderId);
});


it('returns an error if requested order doesnt belong to user', async () => {

    const jwt1 = generateJWTcookieSession();
    const jwt2 = generateJWTcookieSession();

    const ticket = Ticket.build({
        title:"concert",
        price: 20
    });

    await ticket.save();

    const response  = await request(app)
        .post('/api/orders')
        .set("Cookie", jwt1)
        .send({
            ticketId: ticket.id
        });

    const orderId = response.body.id;

    await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Cookie", jwt2)
        .expect(404);


});