import express from 'express';
import {json} from 'body-parser';
import {currentUserRouter} from './routes/current-user';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';

const app = express();
app.use(json());

app.use(
    currentUserRouter,
    signOutRouter,
    signUpRouter,
    signInRouter);

app.listen(3000, () => {
    console.log("Listenin' on port 3000");
});

