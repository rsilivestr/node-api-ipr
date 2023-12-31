import cors from 'cors';
import dotenv from 'dotenv';
import express, { json, Express, Request, Response } from 'express';
import helmet from 'helmet';

import auth from './routes/auth';
import authors from './routes/authors';
import categories from './routes/categories';
import comments from './routes/comments';
import drafts from './routes/drafts';
import posts from './routes/posts';
import tags from './routes/tags';
import users from './routes/users';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(json());

const baseUrl = '/api/v1';

app.get(baseUrl, (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use(`${baseUrl}/auth`, auth);
app.use(`${baseUrl}/authors`, authors);
app.use(`${baseUrl}/categories`, categories);
app.use(`${baseUrl}/comments`, comments);
app.use(`${baseUrl}/drafts`, drafts);
app.use(`${baseUrl}/posts`, posts);
app.use(`${baseUrl}/tags`, tags);
app.use(`${baseUrl}/users`, users);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
