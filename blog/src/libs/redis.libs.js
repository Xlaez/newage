const { createClient } = require('redis');
const { logger } = require('@dolphjs/core');
const { redis } = require('../configs');

const connection = async () => {
  const client = createClient({
    url: redis.url,
  });
  await client.connect();

  client.on('error', (err) => logger.error('Redis Client Error', err));
  client.on('connect', () => logger.info('Redis Client Connection Successful'));
  return client;
};

/**
 *
 * @param {string} key
 * @param {string} value
 * @param {Date} expiresIn default set to 10 minutes
 */
const addToRedis = async (key, value, expiresIn = 60 * 10) => {
  const redisClient = await connection();
  try {
    return await redisClient.set(key, value, 'Ex', expiresIn);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteFromRedis = async (key) => {
  const redisClient = await connection();
  try {
    return redisClient.del(key);
  } catch (error) {
    throw new Error(error);
  }
};

const getValueFromRedis = async (key) => {
  try {
    const redisClient = await connection();
    return redisClient.get(key);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  addToRedis,
  getValueFromRedis,
  deleteFromRedis,
};
