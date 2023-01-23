const helmet = require('helmet');
const cors = require('cors');
const OwlFactory = require('owl-factory');
const { connect } = require('mongoose');
const { env, port } = require('./configs');
const mongoConfigs = require('./configs/db.configs');
const ExampleRouter = require('./routes/example.routes');
const AuthRouter = require('./routes/auth.routes');
const UserRouter = require('./routes/user.routes');

const server = new OwlFactory([new ExampleRouter(), new AuthRouter(), new UserRouter()], process.env.PORT || port, env, {
  mongodbConfig: null,
});

server.app.use(helmet());
server.app.use(cors({ origin: '*' }));

connect(mongoConfigs.url, mongoConfigs.options)
  // eslint-disable-next-line no-unused-vars
  .then((_result) => {
    server.listen();
  })
  .catch((err) => {
    OwlFactory.logger.error(err);
  });
