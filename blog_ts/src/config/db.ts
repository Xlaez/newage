import { MONGO_URI } from './index';

const mongoConfig: any  ={
   url: MONGO_URI,
   options:{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      dbName: 'test',
   }
}

export default mongoConfig;