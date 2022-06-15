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

import dotenv from 'dotenv';
import { Shopify, ApiVersion } from '@shopify/shopify-api';
dotenv.config();

import compression from 'compression';
import serveStatic from 'serve-static';
const fs = await import("fs");
import { resolve } from "path";

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import topLevelAuthRedirect from "./helpers/top-level-auth-redirect.js";

const log = console.log;

const port = 3000;
const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_API_SCOPES, HOST, SHOP } = process.env;

import { state } from "./middleware/state.js";
const shops = state.shops;
const ACTIVE_SHOPIFY_SHOPS = state.ACTIVE_SHOPIFY_SHOPS;

const set = {
    API_KEY: SHOPIFY_API_KEY,
    API_SECRET_KEY: SHOPIFY_API_SECRET,
    API_VERSION: ApiVersion.April22,
    SCOPES: SHOPIFY_API_SCOPES,
    HOST_NAME: HOST,
    IS_EMBEDDED_APP: true,
    // This should be replaced with your preferred storage strategy
    SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
};
log('Set: ', set);
Shopify.Context.initialize(set);

const app = express();
app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
// app.set("use-online-tokens", USE_ONLINE_TOKENS);

app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

app.get("/session-info", async (req, res) => {
    const shop = req.query.shop;
    const session = shops[shop];
    res.json({
        sessionSave: session,
        shops
    })
});

applyAuthMiddleware(app);

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
    path: "/webhooks",
    webhookHandler: async (topic, shop, body) => {
        delete ACTIVE_SHOPIFY_SHOPS[shop];
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

app.use(express.json());

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

app.use("/api/*", async (req, res, next) => {
    log('*1', req.query);
    const shop = req.query.shop;
    log('*2', shop);
    if (!shop) return res.json({ msg: 'must be -> req.query.shop' })
    log('*3');
    const session = shops[shop];
    log('*4', session);
    if (session) return next();
    log('*5');
    res.status(302).redirect(`/auth?shop=${req.query.shop}`);
});


/*
    Other routes
*/

app.get("/api/products", async (req, res) => {
    try {
        log('req.query 2', req.query);
        const shop = req.query.shop;
        const session = shops[shop];
        log('products session', session);
        // Create a new client for the specified shop.
        const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
        const products = await client.get({
            path: 'products',
        });
        log(products);
        res.status(200).send(products);
    } catch (error) {
        log('products error', error);
    }
});

// app.get("api/products-count", verifyRequest(app), async (req, res) => {
app.get("/api/products-count", async (req, res) => {
    const shop = req.query.shop;
    const session = shops[shop];
    log(Shopify.Context.API_VERSION);
    const { Product } = await import(
        `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    const countData = await Product.count({ session });
    res.status(200).send(countData);
});

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
    // Client-side routing will pick up on the correct route to render, so we always render the index here
    res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/app-front/dist/index.html`));
});

app.listen(process.env.PORT || port, () => {
    log(`Server running at ${port}`);
});