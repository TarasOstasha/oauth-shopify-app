import { log } from 'high-level';
import { rand_str_long, pro, lex, } from '../../my_modules/staff.js';
import { User } from '../../models/index.js';
import mail from './mail.service.js';
import user from './user.service.js';

import { shops, state, } from "../../middleware/state.js";


class AuthService {
    constructor() { }

    async sessionInfo(shop) {
        const session = shops[shop];
        return {
            ok: true,
            result: {
                sessionSave: session,
                shops
            }
        }
    }

    async preparedProducts(shop){
        
    }

};

export default new AuthService();
