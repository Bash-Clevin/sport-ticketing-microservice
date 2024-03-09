import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { NotFoundError, errorHandler, currentUser } from '@clevinbash/library';
import { createTicketRouter } from './routes/new-ticket';
import { showTicketRouter } from './routes/show-ticket';
import { listTicketsRouter } from './routes/list-tickets';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(listTicketsRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
