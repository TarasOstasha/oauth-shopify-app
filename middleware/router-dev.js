import {
    shops,
    state,  
} from "./state.js";
const log = console.log;
import {  prepareData, } from '../core/controllers.js';


export default function router(app) {

    app.get("/session-info", async (req, res) => {
        const shop = req.query.shop;
        const session = shops[shop];
        res.json({
            sessionSave: session,
            shops
        })
    });

    // app.get("/api/prepare-data", async (req, res) => {
    //     await prepareData(req.query.shop);
    //     res.status(200).send('ok');
    // });

    app.get("/api/products-prepared", async (req, res) => {
        await prepareData(req.query.shop);
        res.status(200).send(state.products);
    });

}
