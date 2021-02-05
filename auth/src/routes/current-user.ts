import express, { Request, Response } from 'express';
import { currentUser } from '@applinh/mcta-common';

const router = express.Router();

router.get('/api/users/currentuser',
    currentUser,
    (req: Request, res: Response) => {
        
        res.send({currentUser: req.currentUser || null }); // Retrieved from the middleware
});


export {router as currentUserRouter};