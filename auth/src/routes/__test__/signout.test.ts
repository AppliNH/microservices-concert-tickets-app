import request from 'supertest';
import {app} from '../../app';

it('removes cookies when signout', async () => {
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

    const response2 = await request(app) 
        .post('/api/users/signout')
        .send({})
        .expect(200);
    
    // Check cookie got deleted
    expect(response2.get('Set-Cookie')).toEqual(
        ["express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"]
    );
});