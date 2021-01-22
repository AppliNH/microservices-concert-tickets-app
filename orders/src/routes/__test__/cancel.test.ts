import { OrderStatus } from '@react-node-microservices-course/common';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket.model';
import { generateJWTcookieSession } from '../../test/auth-helper';




it('cancels an order', async () => {

    const jwt1 = generateJWTcookieSession();

    const ticket = Ticket.build({
        title: "concert",
        price: 20
    });

    await ticket.save()

    const res = await request(app)
        .post('/api/orders')
        .set('Cookie', jwt1)
        .send({
            ticketId: ticket.id
        })
        .expect(201);
        
    const orderId = res.body.id;

    await request(app)
        .patch(`/api/orders/${orderId}`)
        .set("Cookie", jwt1)
        .expect(204);

    const resGet = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Cookie", jwt1)
        .expect(200);
    

    
    expect(resGet.body.status).toEqual(OrderStatus.Cancelled);
})