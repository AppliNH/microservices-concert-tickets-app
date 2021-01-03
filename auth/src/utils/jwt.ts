import jwt from 'jsonwebtoken';

const generateJWT = (id: any, email: string) => {

    return jwt.sign(
        {
           id, email
        }, 
        process.env.JWT_KEY! // The ! lets TS know that we made sure to throw error (index.ts) if this wasn't defined
    );
}

export {generateJWT}