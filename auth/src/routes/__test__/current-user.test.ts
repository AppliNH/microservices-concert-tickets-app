import request from 'supertest';
import {app} from '../../app';
import { signupHelper } from '../../test/auth-helper';


it('retrieves with details about current user', async () => {

    const cookie = await signupHelper();

    const res = await request(app) 
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(res.body.currentUser.email).toEqual("toto@toto.fr");
});

it('throws an error if not authenticated', async () => {

    await request(app) 
        .get('/api/users/currentuser')
        .send()
        .expect(401);

});