import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request.error';

const router = express.Router();

router.get('/api/users/currentuser',
    (req: Request, res: Response) => {
        if(!req.session?.jwt) {
            throw new BadRequestError('Wrong credentials (no token)');
        }
        try {
            const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
            res.send({currentuser: payload});
        } catch(err) {
            throw new BadRequestError("Couldn't validate token");
        }

        

});


export {router as currentUserRouter};