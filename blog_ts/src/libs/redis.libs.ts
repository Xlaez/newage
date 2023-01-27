import { createClient } from 'redis'
import { redis } from '../config';
import { logger } from 'owl-factory';




const connection = async () => {
	const client = createClient({
		url: redis.url,
	});
	await client.connect();

	client.on('error', (err) => logger.error('Redis Client Error', err));
	client.on('connect', () => logger.info('Redis Client Connection Successful'));
	return client;
};


const addToRedis =  async (key: string, value: string, expiresIn = 60 * 10) => {
	const redisClient = await connection();
	return await redisClient.set(key, value, 'Ex', expiresIn);
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
