import { Pool } from 'pg';

const db = new Pool();
db
  .connect()
  .then(() => console.log('⚡️[server]: Connected to database'))
  .catch((err) => console.log(err.message));

export default db;
