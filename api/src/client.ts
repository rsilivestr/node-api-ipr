import { Client } from 'pg';

const client = new Client();

client
  .connect()
  .then(() => console.log('⚡️[server]: Connected to database'))
  .catch((err) => console.error('⚡️[server]: Database connection error', err.message));

export default client;
