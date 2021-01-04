import request from 'supertest';
import {app} from '../../app';

it('retrieves with details about current user', async () => {
    const signupResponse = await request(app) 
        .post('/api/users/signup')
        .send({
            email: "toto@toto.fr",
            password: "mypass"
        })
        .expect(201);

    // Check if it's setting the JWT as a cookie in the response
    expect(signupResponse.get("Set-Cookie")).toBeDefined();

    const cookie = signupResponse.get('Set-Cookie');

    const res = await request(app) 
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(res.body.currentUser.email).toEqual("toto@toto.fr");

});