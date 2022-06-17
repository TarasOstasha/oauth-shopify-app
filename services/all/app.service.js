import { log } from 'high-level';
import { App } from '../../models/index.js';

class  AppService {
    constructor() { }

    async createIfAbsent  ()  {
        // Сheck if the App Settings exists - Don't add duplicate Settings
        if (!await App.findOne()) await new App({
            name: 'Example Institution',
            hotel: {
                map: {
                    coordinates: {
                        x: 0,
                        y: 0,
                    }
                }
            }
        }).save();
        return { ok: true };
    }

    async saveInfo (info) {
        this.createIfAbsent();
        return await App.findOneAndUpdate({}, info);
    }

    async getInfo()  {
        this.createIfAbsent();
        return await App.findOne({});
    }

    async getInfoSafe()  {
        this.createIfAbsent();
        const _ = await this.getInfo();
        return {
            name: _.name,
            hotel: {
                map: {
                    coordinates: _.hotel.map.coordinates
                }
            },
            google_api_key: _.google_api_key
        };
    }

    async getGoogleApiJSON()  {
        const _ = await this.getInfo();
        return JSON.parse(_.google_api_JSON)
    }
};

export default new  AppService();





