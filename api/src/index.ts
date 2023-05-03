import express, { json, Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import users from './routes/users';

dotenv.config();

const app: Express = express();
app.use(json());
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/users', users);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
