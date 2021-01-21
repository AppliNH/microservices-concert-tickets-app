import { app } from "../../app";
import request from 'supertest';
import { Ticket } from "../../models/ticket.model";
import { generateJWTcookieSession } from "../../test/auth-helper";

it('fetches orders for a particular user', async () => {

    const jwt1 = generateJWTcookieSession();
    const jwt2 = generateJWTcookieSession();

    const ticket1 = Ticket.build({
        title:"concert1",
        price: 20
    });

    const ticket2 = Ticket.build({
        title:"concert2",
        price: 20
    });

    const ticket3 = Ticket.build({
        title:"concert3",
        price: 20
    });

    await ticket1.save();
    await ticket2.save();
    await ticket3.save();

        
    await request(app)
        .post('/api/orders')
        .set("Cookie", jwt1)
        .send({
            ticketId: ticket1.id
        });

    await request(app)
        .post('/api/orders')
        .set("Cookie", jwt2)
        .send({
            ticketId: ticket2.id
        });

    await request(app)
        .post('/api/orders')
        .set("Cookie", jwt2)
        .send({
            ticketId: ticket3.id
        });
    
    const response1 = await request(app)
        .get('/api/orders')
        .set("Cookie", jwt1);

    const response2 = await request(app)
        .get('/api/orders')
        .set("Cookie", jwt2);
    
        
    expect(response1.body.length).toEqual(1);
    expect(response2.body.length).toEqual(2);
    
});