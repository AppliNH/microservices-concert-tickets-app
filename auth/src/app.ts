// Express app setup

import express from 'express';
import 'express-async-errors'; // handling errors from async jobs. Just import it like it, RIGHT AFTER express
import {json} from 'body-parser';
import cookieSession from 'cookie-session';

import {currentUserRouter} from './routes/current-user';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';
import { errorHandler } from './middlewares/error-handler';
import NotFoundError from './errors/not-found.error';

const app = express();
app.set('trust proxy', true); // Makes sure that express is being awared of being behind the nginx proxy and accepts trafic
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: true // Will only return cookie if the query is made with https !!
    })
); 

// Routes
app.use(
    currentUserRouter,
    signOutRouter,
    signUpRouter,
    signInRouter);

// Handle unknown routes queries, with custom error, to be handled with
// the custom error handler
app.all('*', async (req, res) => {
    throw new NotFoundError();
});


// Middlewares
app.use(errorHandler);


export { app };