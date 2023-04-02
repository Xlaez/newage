/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const cors = require('cors');
const Dolph = require('@dolphjs/core');
const { env, port } = require('./configs');
const mongoConfigs = require('./configs/db.configs');
const AuthRouter = require('./routes/auth.routes');
const UserRouter = require('./routes/user.routes');
const PostRouter = require('./routes/post.routes');
const NotificationRouter = require('./routes/notification.routes');

const routes = [new AuthRouter(), new UserRouter(), new PostRouter(), new NotificationRouter()];

const dolph = new Dolph(routes, process.env.PORT || port, env, { options: mongoConfigs.options, url: mongoConfigs.url }, [
  cors({ origin: '*' }),
]);
dolph.listen();
