import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { NotFoundError, errorHandler } from '@clevinbash/library';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
