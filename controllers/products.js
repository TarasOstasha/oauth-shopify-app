import { ProductService } from '../services/index.js';
// import { log, } from '../../../high-level/index.js';
import { log } from 'high-level';
import Controller from '../classes/controller.class.js';

class getProductsController extends Controller {
    conName = 'Get products';
    successMsg = 'Products';
    unSuccessMsg = 'Cannot get products!';
    do = async _ => this.result = await ProductService.get(this.req.query.shop);
}

// class GQLgetProductsController extends Controller {
//     conName = 'Get products';
//     successMsg = 'Products';
//     unSuccessMsg = 'Cannot get products!';
//     do = async _ => this.result = await ProductService.get(this.req.query.shop);
// }

export { getProductsController };
