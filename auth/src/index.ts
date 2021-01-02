import express from 'express';
import 'express-async-errors'; // handling errors from async jobs. Just import it like it, RIGHT AFTER express
import {json} from 'body-parser';
import {connect} from 'mongoose';

import {currentUserRouter} from './routes/current-user';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';
import { errorHandler } from './middlewares/error-handler';
import NotFoundError from './errors/not-found.error';


const app = express();
app.use(json());

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


// startup script
const start = async() => {
    try {
        await connect('mongodb://auth-mongo-service:27017/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } catch(err) {
        console.error(err);
    }

    console.log("Conencted to auth-mongo !")

    app.listen(3000, () => {
        console.log("Listenin' on port 3000");
    });

};

start();