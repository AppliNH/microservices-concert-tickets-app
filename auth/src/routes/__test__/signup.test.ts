import request from 'supertest';
import {app} from '../../app';

it('awaits a 201 on successful signup', async () => {
    await request(app) // await or return is equivalent here
        .post('/api/users/signup')
        .send({
            email: "toto@toto.fr",
            password: "mypass"
        })
        .expect(201);
});

it('awaits 400 with invalid email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "toto",
            password: "mypass"
        })
        .expect(400);
});

it('awaits 400 with invalid password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "toto@toto.fr",
            password: "boi"
        })
        .expect(400);
});

it('awaits 400 with missing email and passwword', async () => {

    await request(app)
    .post('/api/users/signup')
    .send({
        email: "toto@toto.fr"
    })
    .expect(400);

    await request(app)
    .post('/api/users/signup')
    .send({
        password: "mypass"
    })
    .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400);
});

it('disallows duplicate emails', async() => {
    await request(app) // await or return is equivalent here
        .post('/api/users/signup')
        .send({
            email: "toto@toto.fr",
            password: "mypass"
        })
        .expect(201);

    await request(app) 
    .post('/api/users/signup')
    .send({
        email: "toto@toto.fr",
        password: "bruh"
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {

    const response = await request(app) 
        .post('/api/users/signup')
        .send({
            email: "toto@toto.fr",
            password: "mypass"
        })
        .expect(201);
    
    // Check if it's setting the JWT as a cookie in the response
    expect(response.get("Set-Cookie")).toBeDefined();
    

})