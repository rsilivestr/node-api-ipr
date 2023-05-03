import { Router } from 'express';
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
  const { login } = req.body;
  client
    .query('SELECT login FROM users WHERE login=$1', [login])
    .then(({ rows }) => {
      if (rows.length > 0) {
        res.status(409).send('Such login already exists');
      } else {
        client
          .query('INSERT INTO users (login) VALUES ($1)', [login])
          .then(() => res.sendStatus(201))
          .catch(() => res.sendStatus(500));
      }
    })
    .catch(() => res.sendStatus(500));
});

export default router;
