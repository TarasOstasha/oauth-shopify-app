import { Shopify } from "@shopify/shopify-api";
import verifyRequest from "./verify-request.js";
import { shops, state, } from "./state.js";
const log = console.log;
import { getProducts, productsCount, prepareData, } from '../core/controllers.js';


export default function router(app) {

    app.get("/api/products", async (req, res) => {
        const products = await getProducts(req.query.shop);
        res.status(200).send(state.products);
    });

    // app.get("api/products-count", verifyRequest(app), async (req, res) => {
    app.get("/api/products-count", async (req, res) => {
        const countData = await productsCount(req.query.shop);
        res.status(200).send(countData);
    });

}
