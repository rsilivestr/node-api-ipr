import express, { json, Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import users from './routes/users';
import authors from './routes/authors';
import auth from './routes/auth';

dotenv.config();

const app: Express = express();

app.use(json());

const baseUrl = '/api/v1';

app.get(baseUrl, (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use(`${baseUrl}/users`, users);
app.use(`${baseUrl}/authors`, authors);
app.use(`${baseUrl}/auth`, auth);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
