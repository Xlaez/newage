import  OwlFactory from 'owl-factory';
import helmet from 'helmet';
import * as dotenv from 'dotenv'
import { exit } from 'process';
import mongoConfig from './config/db';
import { ENV, PORT } from './config';

dotenv.config();


const server = new OwlFactory(,  3000,  'development ',  {
   mongodbConfig: mongoConfig
} )

