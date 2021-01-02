import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import { RequestValidationError } from '../errors/request-validation.error';


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

        console.log("Creating user !");

        res.send({})

});


export {router as signUpRouter};