import express from 'express';
import {json} from 'body-parser';
import {currentUserRouter} from './routes/current-user';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';
import { errorHandler } from './middlewares/error-handler';

const app = express();
app.use(json());

// Routes
app.use(
    currentUserRouter,
    signOutRouter,
    signUpRouter,
    signInRouter);

// Middlewares
app.use(errorHandler)

app.listen(3000, () => {
    console.log("Listenin' on port 3000");
});

