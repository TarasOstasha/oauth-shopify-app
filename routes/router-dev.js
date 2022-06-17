const log = console.log;
// import { log, } from '../../../high-level/index.js';
// import { RegisterController } from '../controllers/auth.js';
import { SessionInfoController, PreparedProductsController } from '../controllers/dev.js';

import verifyRequest from "../middleware/verify-request.js";
import { shops, state, } from "../middleware/state.js";

export default function router(app) {
    [
      { path: '/session-info', method: 'get', controller: SessionInfoController },
      { path: '/api/products-prepared', method: 'get', controller: PreparedProductsController }
    ].forEach(
      // it is like - app.post('/register', mediator.bind(new RegisterController()));
      item => app[item.method](item.path, mediator.bind(new item.controller()))
    );
}

async function mediator(req, res, next) {
    const DTO = await this.go(req, res);
    res.json(DTO);
};

