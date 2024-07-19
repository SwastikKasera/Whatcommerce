import { createClient } from "redis";

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

async function connectToRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

const redisAdd = async (key: string, value: string, expireTime: number) => {
  await connectToRedis();
  return client.set(key, value, { EX: expireTime });
};

const redisGet = async (key: string) => {
  await connectToRedis();
  return client.get(key);
};

const redisAddJson = async (key: string, value: any, expireTime: number) => {
  await connectToRedis();
  return client.set(key, JSON.stringify(value), { EX: expireTime });
};

const redisGetJson = async (key: string) => {
  await connectToRedis();
  const result = await client.get(key);
  return result ? JSON.parse(result) : null;
};

export { redisAdd, redisGet, redisAddJson, redisGetJson };