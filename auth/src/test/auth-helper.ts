import request from "supertest";
import { app } from "../app";

const signupHelper = async() => {

    const crendentials = {
        email: "toto@toto.fr",
        password: "mypass"

    };

    const response = await request(app)
        .post('/api/users/signup')
        .send(crendentials)
        .expect(201);
    
    const cookie = response.get('Set-Cookie');

    return cookie;
}

const signinHelper = async() => {

    const crendentials = {
        email: "toto@toto.fr",
        password: "mypass"

    };

    const response = await request(app)
        .post('/api/users/signin')
        .send(crendentials)
        .expect(200);
    
    const cookie = response.get('Set-Cookie');

    return cookie;
} 

export {signupHelper,signinHelper }