import request from 'supertest';
import { app } from '../../app';
import { generateJWTcookieSession } from '../../test/auth-helper';
import mongoose from 'mongoose';
import { Order } from '../../models/order.model';
import { OrderStatus } from '@react-node-microservices-course/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment.model';

jest.mock("../../stripe");

it("throws an error if order doesn't exist", async() => {

    const jwt = generateJWTcookieSession()

    await request(app)
        .post("/api/payments")
        .set('Cookie', jwt)
        .send({
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)

});


it("throws when purchasing an order that doesn't belong to user", async() => {

    const jwt1 = generateJWTcookieSession();

    const order = Order.build({
        id:  mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created,
        userId: "aaa"
    });

    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", jwt1)
        .send({
            orderId: order.id
        })
        .expect(401)

});


it("throws an error when trying to purchase a cancelled order", async() => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const jwt = generateJWTcookieSession(userId);

    const order = Order.build({
        id:  mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Cancelled,
        userId
    });

    await order.save();

    await request(app)
        .post("/api/payments")
        .set('Cookie', jwt)
        .send({
            orderId: order.id
        })
        .expect(400)

});


it("returns a 201 with valid inputs", async () => {

    const userId = mongoose.Types.ObjectId().toHexString();
    const jwt = generateJWTcookieSession(userId);

    const order = Order.build({
        id:  mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created,
        userId
    });

    await order.save();

    await request(app)
        .post("/api/payments")
        .set('Cookie', jwt)
        .send({
            orderId: order.id
        })
    .expect(201);

    

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(stripe.charges.create).toHaveBeenCalled();
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(20*100);
    expect(chargeOptions.currency).toEqual('eur');

    
});


