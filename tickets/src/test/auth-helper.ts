import jwt from 'jsonwebtoken'

const generateJWTcookieSession = () => {

    const crendentials = {
        email: "toto@toto.fr",
        id: "1212myid"
    };

    const token = jwt.sign(crendentials, process.env.JWT_KEY!);

    // Session object
    const session = {jwt:token}

    const sessionJSON = JSON.stringify(session);

    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Array is just for supertest
    return [`express:sess=${base64}`];
    
}

export {generateJWTcookieSession }