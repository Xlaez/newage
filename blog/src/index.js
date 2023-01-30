/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const helmet = require('helmet');
const cors = require('cors');
const OwlFactory = require('owl-factory');
const { connect } = require('mongoose');
const { env, port } = require('./configs');
const mongoConfigs = require('./configs/db.configs');
const AuthRouter = require('./routes/auth.routes');
const UserRouter = require('./routes/user.routes');
const PostRouter = require('./routes/post.routes');
const NotificationRouter = require('./routes/notification.routes');

const server = new OwlFactory(
  [new AuthRouter(), new UserRouter(), new PostRouter(), new NotificationRouter()],
  process.env.PORT || port,
  env,
  {
    mongodbConfig: null,
  }
);

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
