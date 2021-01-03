import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import { BadRequestError } from '../errors/bad-request.error';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post('/api/users/signup', 
    [
        body("email") // Checks that body contains property "email"..
            .isEmail()
            .withMessage("Email is not valid"),
        body("password")
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage("Password is not valid")
    ],
    validateRequest, // middleware
    async (req: Request, res: Response) => {
        
        const {email, password} = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log("email "+email+" already in use.")
            throw new BadRequestError("email "+email+" already in use.");
        }

        const user = User.build({ email, password });
        await user.save();

        // Generate JWT
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email
            }, 
            process.env.JWT_KEY! // The ! lets TS know that we made sure to throw error (index.ts) if this wasn't defined
        );

        // Store the jwt on session object (only if you query with https ! Otherwise, no cookie.)
        // we're doing that because the client will be server-side rendered, so it's easier
        // But it is also possible to do that with a client-side webclient
        // The jwt is fully base64 encoded. So decode it first and then you can go to jwt.io to read it
        req.session = {jwt: userJwt};

        res.status(201).send(user);

});


export {router as signUpRouter};