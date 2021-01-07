import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request.error';

interface UserPayload {
    id: string;
    email: string;
}


// Reach into existing type definition and make a modification to it
declare global { 
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if(!req.session?.jwt) {
        throw new BadRequestError('Wrong credentials (no token)');
    }
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    } catch(err) {
        throw new BadRequestError("Couldn't validate token");
    }

    next();
};