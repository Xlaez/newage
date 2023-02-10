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


const addToRedis =  async (key: any | object, value: any | number , expiresIn = 60 * 10)=> {
	const redisClient = await connection();
	return await redisClient.set(key, value, expiresIn);
};

const deleteFromRedis = async (key: any | object) => {
	const redisClient = await connection();
	try {
		return redisClient.del(key);
	} catch (error: any) {
		throw new Error(error);
	}
};

const getValueFromRedis = async (key: any | object ) => {
	try {
		const redisClient = await connection();
		return redisClient.get(key);
	} catch (error: any) {
		throw new Error(error);
	}
};

export {
	addToRedis,
	deleteFromRedis,
	getValueFromRedis
}
