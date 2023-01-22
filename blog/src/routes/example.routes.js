const { Router, catchAsync } = require('owl-factory');
const { saveData } = require('../controllers/example.controller');

class ExampleRouter {
  constructor() {
    this.router = Router();
    this.path = '/example';
    this.Routes();
  }

  Routes() {
    this.router.get(
      `${this.path}`,
      catchAsync((req, res) => {
        res.send('hello');
      })
    );
    this.router.post(`${this.path}`, saveData);
  }
}

module.exports = ExampleRouter;
