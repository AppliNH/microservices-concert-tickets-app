import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError,validateRequest } from '@applinh/mcta-common';
import { User } from '../models/user.model';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';
import { generateJWT } from '../utils/jwt';

const router = express.Router();

router.post('/api/users/signin', 
    [
        body("email")
            .isEmail()
            .withMessage("Email is not valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must provide a password")
    ],
    validateRequest, // middleware
    async (req: Request, res:Response) => {

        const {email, password} = req.body;

        const existingUser = await User.findOne({email});

        if (!existingUser) {
            throw new BadRequestError('Bad credentials');
        }

        const passwordMatch = await Password.compare(existingUser.password, password);

        if (!passwordMatch) {
            throw new BadRequestError('Bad credentials');
        }

        // Generate JWT
        const userJwt = generateJWT(existingUser.id, existingUser.email);

        req.session = {jwt: userJwt};

        res.status(200).send(existingUser);
        
    }
);


export {router as signInRouter};