import express, {Request, Response} from 'express';
import {body} from 'express-validator';

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
    (req: Request, res: Response) => {

        const {email, password} = req.body;

});


export {router as signUpRouter};