import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import { BadRequestError } from '../errors/bad-request.error';
import { RequestValidationError } from '../errors/request-validation.error';
import { User } from '../models/user.model';


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
    async (req: Request, res: Response) => {
        const errors = validationResult(req); // Needed to trigger validators above

        if(!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }

        const {email, password} = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log("email "+email+" already in use.")
            throw new BadRequestError("email "+email+" already in use.");
        }

        const user = User.build({ email, password });
        await user.save();

        res.status(201).send(user);




});


export {router as signUpRouter};