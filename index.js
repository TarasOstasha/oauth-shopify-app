/*
                    ██████╗░███████╗██╗░░░██╗░░░░░░░█████╗░██████╗░████████╗
                    ██╔══██╗██╔════╝██║░░░██║░░░░░░██╔══██╗██╔══██╗╚══██╔══╝
                    ██║░░██║█████╗░░╚██╗░██╔╝█████╗███████║██████╔╝░░░██║░░░
                    ██║░░██║██╔══╝░░░╚████╔╝░╚════╝██╔══██║██╔══██╗░░░██║░░░
                    ██████╔╝███████╗░░╚██╔╝░░░░░░░░██║░░██║██║░░██║░░░██║░░░
                    ╚═════╝░╚══════╝░░░╚═╝░░░░░░░░░╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░
*/

import express from 'express';
import cookieParser from 'cookie-parser';

import { Shopify } from '@shopify/shopify-api';

import compression from 'compression';
import serveStatic from 'serve-static';
import { resolve } from "path";

import applyAuthMiddleware from "./middleware/auth.js";
import router from "./middleware/router.js";
import routerDev from "./middleware/router-dev.js";

import verifyRequest from "./middleware/verify-request.js";

const fs = await import("fs");
const log = console.log;

const port = 3000;
const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

import { shops, context, state } from "./middleware/state.js";


log('context: ', context);
Shopify.Context.initialize(context);


const app = express();
app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
app.set("active-shopify-shops", shops);
// app.set("use-online-tokens", USE_ONLINE_TOKENS);


app.use(express.json());
app.use(cookieParser(Shopify.Context.API_SECRET_KEY));
routerDev(app);
applyAuthMiddleware(app);





Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
    path: "/webhooks",
    webhookHandler: async (topic, shop, body) => {
        delete shops[shop];
    },
});

app.post("/webhooks", async (req, res) => {
    try {
        await Shopify.Webhooks.Registry.process(req, res);
        log(`Webhook processed, returned status code 200`);
    } catch (error) {
        log(`Failed to process webhook: ${error}`);
        if (!res.headersSent) res.status(500).send(error.message);
    }
});


app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
        res.setHeader(
            "Content-Security-Policy",
            `frame-ancestors https://${shop} https://admin.shopify.com;`
        );
    } else {
        res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    };
    next();
});







/*
    Other routes
*/
router(app);


// app.post("/graphql", verifyRequest(app), async (req, res) => {
app.post("/graphql", async (req, res) => {
    try {
        const response = await Shopify.Utils.graphqlProxy(req, res);
        res.status(200).send(response.body);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.use(compression());
app.use(serveStatic(resolve("app-front/dist")));

app.use("/*", (req, res, next) => {
    // Client-side routing will pick up on the correct route to render, 
    // so we always render the index here
    res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/app-front/dist/index.html`));
});

app.listen(process.env.PORT || port, () => {
    log(`Server running at ${port}`);
});