import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';

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
        const errors = validationResult(req); // Needed to trigger validators above

        if(!errors.isEmpty()) {
            return res.status(400).send(errors.array());
        }

        const {email, password} = req.body;

        console.log("signup");

        res.send({})

});


export {router as signUpRouter};