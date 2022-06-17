import { log, randomString} from 'high-level';
import { User } from '../../models/index.js';
import mail from './mail.service.js';
import crypto from './crypto.service.js';

class UserService {
    constructor() { }
    getAll = async (q = {}) => await User.find(q);
    getByAssToken = async (ass_token) => await User.findOne({ ass_token });
    getOne = async (q) => await User.findOne(q);
    async add(msg) {
        try {
            const userByEmail = await this.getOne({ email: msg.email });
            if (userByEmail) return { ok: false, msg: 'Email already exists!' };
            const userByUsername = await User.findOne({ username: msg.username }); // User already exists  ?
            if (userByUsername) return { ok: false, msg: 'User already exists!' };
            // do
            const userInfo = {
                role: msg.role || 'guest',
                name: msg.name || msg.firstName + ' ' + msg.lastName,
                phone: msg.phone,
                language: msg.language || 'en',
                room: msg.room,
                username: msg.username,
                email: msg.email,
                openPassword: msg.openPassword,
                password: crypto.hash(msg.password + ''),
                emailToken: randomString(4),
                authToken: randomString(4),
                assToken: randomString(4),
                wallets: {
                    USD: {
                        balance: 0
                    }
                },
                facebook: {
                    id: '',
                    token: '',
                    email: '',
                    username: ''
                },
                google: {
                    id: '',
                    token: '',
                    email: '',
                    username: ''
                },
                active: false,
                emailVerif: false,
                phoneVerif: false,
            };
            await this.create(userInfo);

            return { ok: true, msg: 'temp' };

            try { mail.sendMailVerification(u._id); } // ...................................... send mail for verification
            catch (error) { log('Mails again not working! (file: controllers/users/create-new-user)'); };

            return { ok: true };
        } catch (error) {
            log('Error in user service!', error).place();
            return { ok: false, msg: 'Error in user service!', error };
        }
    }

    create = async (o) => await new User(o).save()

    delAll = async () => await User.deleteMany({})

    async edit(_id, msg) {
        let edit = {}; // ......................................................... edit obj
        const isArray = msg instanceof Array; // ............................. must be array
        if (isArray) msg.forEach(el => edit[el.key] = el.newValue); // ...... build edit obj
        await User.findOneAndUpdate({ _id }, edit); // .............................. update
        return { ok: true };
    }

    async fake() {
        return JSON.parse(`{
            "wallets": {
            "USD": {
                "balance": 0
            }
            },
            "facebook": {
            "id": "",
            "token": "",
            "email": "",
            "username": ""
            },
            "google": {
            "id": "",
            "token": "",
            "email": "",
            "username": ""
            },
            "isLogged": true,
            "purchases_made": [],
            "saved_numbers": [],
            "linked_users": [],
            "_id": "5e72314405de434144dca5be",
            "username": "testUser",
            "email": "shadespiritenator@gmail.com",
            "email_token": "077q6b76v9vwqtaryepfjbseao0fdprrj7chg22dlhj",
            "password": "cd2a9a2e8d3572113b95e3b60bf626a77899ec6b",
            "phone_pin": 730901,
            "link_pin": 272749,
            "active": false,
            "email_verif": false,
            "phone_verif": false,
            "ever_cha": "7645e520-6925-11ea-977c-578729c8c9f9",
            "ever_sec": "4c04539621e9baec7e8651059293a71573409788",
            "last_login": "2020-03-18T14:33:40.735Z",
            "last_appeal": "2020-03-18T14:33:40.736Z",
            "__v": 0
        }`);
    }
};

export default new UserService();