const level = '../../';
const { log, pro, lex } = require(`${level}my_modules/staff`);
const { ChatMsg } = require(`${level}models`);

class Service {
    constructor() { }

    async get(_id, ip) {
        // const essences = (_id) ?
        //     await Essence.findOne({ _id }) :
        //     (ip) ?
        //         await Essence.find({ ip }) :
        //         await Essence.find({});
        // return { essences };
    }

    async add(msg) {
        // await self.create(msg);
        // return { ok: true };
    }

    async create(msg) {
        // await new Essence({
        //     essence: msg.essence,
        //     administrator: msg.administrator,
        //     email: msg.email,
        //     ip: msg.ip
        // }).save();
    }

    async del(_id) {
        // await self.remove(_id);
        // return { ok: true };
    }

    async remove(_id) {
        // await Essence.findOneAndRemove({ _id });
    }

    async edit(msg) {
        // await Essence.findByIdAndUpdate({ _id: msg._id }, {
        //     Essence: msg.Essence,
        //     administrator: msg.administrator,
        //     email: msg.email,
        //     ip: msg.ip,
        //     map: msg.map
        // });
    }

};

export default new AppService();