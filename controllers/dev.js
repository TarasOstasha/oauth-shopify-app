import { DevService } from '../services/index.js';
// import { log, } from '../../../high-level/index.js';
import { log } from 'high-level';

import Controller from '../classes/controller.class.js';

class SessionInfoController extends Controller {
    conName = 'Session-info';
    successMsg = 'Session info';
    unSuccessMsg = 'Cannot get session info!';
    do = async _ => this.result = await DevService.sessionInfo(this.req.query.shop);
}

class PreparedProductsController extends Controller {
    conName = 'Prepared-products';
    successMsg = 'Prepared products';
    unSuccessMsg = 'Cannot get prepared products!';
    do = async _ => this.result = await DevService.preparedProducts(this.req.query.shop);
}

export { SessionInfoController, PreparedProductsController };
