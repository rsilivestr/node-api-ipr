import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const client = new Client();

client
  .connect()
  .then(() => console.log('⚡️[server]: Connected to database'))
  .catch((err) => console.error('⚡️[server]: Database connection error', err.message));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
