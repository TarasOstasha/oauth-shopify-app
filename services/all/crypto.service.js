import { log } from 'high-level';
import sha1 from'sha1';

class  CryptoService {
    constructor() { }
    hash = (input) => sha1(sha1(input) + sha1(process.env.PSWD_SALT))
};

export default new  CryptoService();