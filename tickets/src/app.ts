// Express app setup

import express from 'express';
import 'express-async-errors'; // handling errors from async jobs. Just import it like it, RIGHT AFTER express
import {json} from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUser, errorHandler,NotFoundError } from '@applinh/mcta-common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { showAllTicketsRouter } from './routes/showall';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test"
    })
);
// Routes that don't need auth
app.use(showTicketRouter, showAllTicketsRouter)

// Auth middleware cause some functionalities are reserved to authenticated users
// Only applies to the routes below it
app.use(currentUser);

// Routes that do need auth
app.use(createTicketRouter, updateTicketRouter);

// Handle unknown routes queries, with custom error, to be handled with
// the custom error handler
app.all('*', async (req, res) => {
    throw new NotFoundError();
});


// Middlewares
app.use(errorHandler);


export { app };