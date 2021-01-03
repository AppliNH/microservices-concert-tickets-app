import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';

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
    (req: Request, res:Response) => {




        
    }
);


export {router as signInRouter};