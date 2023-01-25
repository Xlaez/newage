import { config } from "dotenv";
import * as Joi from 'joi';
import * as path from 'path'
config({})

export const { PORT, MONGO_URI, ENV } = process.env;


config({ path: path.join(__dirname, '../../.env') });

/**
 * Pass all the environmental variables into this object
 */
const envVariableSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
    PORT: Joi.number().default(7171),
    MONGO_URI: Joi.string().required().description('Mongo DB uri'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(60).description('minutes after which access tokens expire'),
    REDIS_URL: Joi.string().required().description('Redis Connection String'),
    DB_NAME: Joi.string().default('owl-blog'),
    EMAIL_USER: Joi.string().required().description('email account'),
    SMTP_USERNAME: Joi.string().required().description('smtp username'),
    SMTP_PASSWORD: Joi.string().required().description('smtp password'),
    SMTP_HOST: Joi.string().required().description('smtp host'),
    SMTP_PORT: Joi.string().default(587),
    APP_NAME: Joi.string().default('appname'),
    CLOUD_NAME: Joi.string().description('cloudinary account name'),
    CLOUDINARY_API_KEY: Joi.string().description('cloudinary api key'),
    CLOUDINARY_API_SECRET: Joi.string().description('cloudinary user secret'),
  })
  .unknown();

const { value: envVars, error } = envVariableSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

/**
 * If environmental variable is not found an error is thrown
 */
if (error) {
  throw new Error(`App Config Validation Error: ${error.message}`);
}


const env = envVars.NODE_ENV;
const port = envVars.PORT;
const mongoose ={
    url: envVars,MONGO_URI,
    options:{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      dbName: envVars.DB_NAME
    }
}

const jwt = {
   secret: envVars.JWT_SECRET,
 }

 const redis = {
   url: envVars.REDIS_URL,
 }

 const email = {
   user: envVars.EMAIL_USER,
 }

 const smtp = {
   user: envVars.SMTP_USERNAME,
   pass: envVars.SMTP_PASSWORD,
   host: envVars.SMTP_HOST,
   port: envVars.SMTP_PORT,
 }

 const app =  {
   name: envVars.APP_NAME,
 }


 const cloudinary = {
   name: envVars.CLOUD_NAME,
   key: envVars.CLOUDINARY_API_KEY,
   secret: envVars.CLOUDINARY_API_SECRET,
 }
export {
  env,
  port,
  mongoose,
  jwt,
  redis,
  email,
  smtp,
  app,
  cloudinary,
};
