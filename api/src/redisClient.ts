import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: 'redis',
    port: 6379,
  },
});

redisClient.on('error', (err) => console.log('Redis Server Error', err));

const connect = async () => {
  if (!redisClient.isOpen) await redisClient.connect();
};

export { redisClient, connect };
