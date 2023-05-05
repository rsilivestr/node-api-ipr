import { Pool } from 'pg';

const pool = new Pool();
pool
  .connect()
  .then(() => console.log('⚡️[server]: Connected to database'))
  .catch((err) => console.log(err.message));

export default pool;
