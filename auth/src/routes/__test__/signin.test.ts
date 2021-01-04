import request from 'supertest';
import {app} from '../../app';

it('fails when a email that doesnt exist is supplied', async () => {
    await request(app) 
        .post('/api/users/signin')
        .send({
            email: "toto@toto.fr",
            password: "mypass"
        })
        .expect(400);
});

it('fails when incorrect password', async () => {
    await request(app) 
        .post('/api/users/signup')
        .send({
            email: "toto@toto.fr",
            password: "mypass"
        })
        .expect(201);

    await request(app) 
    .post('/api/users/signin')
    .send({
        email: "toto@toto.fr",
        password: "wrongpass"
    })
    .expect(400);
});

it('succeeds and resp with cookie with valid credentials', async () => {
    await request(app) 
        .post('/api/users/signup')
        .send({
            email: "toto@toto.fr",
            password: "mypass"
        })
        .expect(201);

    const response = await request(app) 
    .post('/api/users/signin')
    .send({
        email: "toto@toto.fr",
        password: "mypass"
    })
    .expect(200);

    // Check if it's setting the JWT as a cookie in the response
    expect(response.get("Set-Cookie")).toBeDefined();

});
