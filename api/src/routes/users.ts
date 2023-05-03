import e, { Router } from 'express';
import client from '../client';

const router = Router();

router.get('/', (req, res) => {
  client
    .query('SELECT * FROM users')
    .then(({ rows }) => {
      res.send(rows);
    })
    .catch(() => res.send(500));
});

router.post('/', async (req, res) => {
  try {
    const { login } = req.body;
    const users = await client.query('SELECT login FROM users WHERE login=$1', [login]);
    if (users.rows.length > 0) {
      res.status(409).send('Such login already exists');
    } else {
      await client.query('INSERT INTO users (login) VALUES ($1)', [login]);
      res.sendStatus(201);
    }
  } catch {
    res.sendStatus(500);
  }
});

export default router;
