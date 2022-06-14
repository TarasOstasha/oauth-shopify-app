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

//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
//const host = '127.0.0.1';
const port = 3000;
const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_API_SCOPES, HOST, SHOP } = process.env;

// sessionSave == shops[shop] == session (Shopify.Utils.loadOfflineSession(SHOP))
const shops = {};
const ACTIVE_SHOPIFY_SHOPS = {};

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
// app.use(cookieParser())
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

/*
--- url from iframe in admin page--- sometime not working !!!
https://oauth-shopify-app.herokuapp.com/?
hmac = f96f9e80c327e56790cfae9d0c1463336abd67f9dc7be7c8105c93bc5381f29c &
host = dG9ueWpvc3Mtc3RvcmUubXlzaG9waWZ5LmNvbS9hZG1pbg &
locale = en &
session = 7995fcfaea4e454672011963028f2804bf5361c621262535a809ebef65396b85 &
shop = tonyjoss-store.myshopify.com &
timestamp = 1654801115

--- but this url also works --- better !!!
https://oauth-shopify-app.herokuapp.com/auth?
shop = tonyjoss-store.myshopify.com

--- sometimes redirect to !!! --- ned authorization in account !!!
https://accounts.shopify.com/lookup?
rid = 7fc0f07d-2026-48f9-bfed-398fdf861178
*/

app.get("/", (req, res) => {
    const isShop = typeof shops[req.query.shop] !== 'undefined';
    if (isShop) res.status(200).redirect(`/app?shop=${req.query.shop}`)
    else res.status(302).redirect(`/auth?shop=${req.query.shop}`);
});

app.get('/auth', async (req, res) => {
    if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
        return res.redirect(
            `/auth/toplevel?${new URLSearchParams(req.query).toString()}`
        );
    }
    const authRoute = await Shopify.Auth.beginAuth(
        req,
        res,
        req.query.shop,
        '/auth/callback',
        false
        // app.get("use-online-tokens")
    )
    res.status(302).redirect(authRoute);
});

app.get("/auth/toplevel", (req, res) => {
    res.cookie(app.get("top-level-oauth-cookie"), "1", {
        signed: true,
        httpOnly: true,
        sameSite: "strict",
    });
    res.set("Content-Type", "text/html");
    res.send(
        topLevelAuthRedirect({
            apiKey: Shopify.Context.API_KEY,
            hostName: Shopify.Context.HOST_NAME,
            host: req.query.host,
            query: req.query,
        })
    );
});

app.get('/auth/callback', async (req, res) => {
    const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
    );
    log('session: ', session);
    shops[session.shop] = session;
    return res.redirect(`/?host=${req.query.host}&shop=${req.query.shop}`);
});

// app.get("/auth/callback", async (req, res) => {
//     try {
//         const session = await Shopify.Auth.validateAuthCallback(
//             req,
//             res,
//             req.query
//         );
//         log('session: ', session);
//         shops[session.shop] = session;

//         const host = req.query.host;
//         app.set(
//             "active-shopify-shops",
//             Object.assign(app.get("active-shopify-shops"), {
//                 [session.shop]: session.scope,
//             })
//         );

//         const response = await Shopify.Webhooks.Registry.register({
//             shop: session.shop,
//             accessToken: session.accessToken,
//             topic: "APP_UNINSTALLED",
//             path: "/webhooks",
//         });

//         if (!response["APP_UNINSTALLED"].success) {
//             console.log(
//                 `Failed to register APP_UNINSTALLED webhook: ${response.result}`
//             );
//         }

//         // Redirect to app with shop parameter upon auth
//         res.redirect(`/?shop=${session.shop}&host=${host}`);
//     } catch (e) {
//         switch (true) {
//             case e instanceof Shopify.Errors.InvalidOAuthError:
//                 res.status(400);
//                 res.send(e.message);
//                 break;
//             case e instanceof Shopify.Errors.CookieNotFound:
//             case e instanceof Shopify.Errors.SessionNotFound:
//                 // This is likely because the OAuth session cookie expired before the merchant approved the request
//                 res.redirect(`/auth?shop=${req.query.shop}`);
//                 break;
//             default:
//                 res.status(500);
//                 res.send(e.message);
//                 break;
//         }
//     }
// });

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
    path: "/webhooks",
    webhookHandler: async (topic, shop, body) => {
        delete ACTIVE_SHOPIFY_SHOPS[shop];
    },
});

app.post("/webhooks", async (req, res) => {
    try {
        await Shopify.Webhooks.Registry.process(req, res);
        console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
        console.log(`Failed to process webhook: ${error}`);
        if (!res.headersSent) {
            res.status(500).send(error.message);
        }
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
    }
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
    //app.get("/admin/api/2022-04/products.json", async (req, res) => {    
    try {
        log('req.query 2', req.query);
        const shop = req.query.shop;
        const session = shops[shop];
        log('products session', session);
        // Create a new client for the specified shop.
        const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
        // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
        const products = await client.get({
            path: 'products',
        });
        console.log(products);
        // const { Product } = await import(
        //   `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
        // );
        // const countData = await Product.count({ session });
        // res.status(200).send(countData);
        res.status(200).send(products);
    } catch (error) {
        log('products error', error);
    }
});


// app.get("api/products-count", verifyRequest(app), async (req, res) => {
app.get("/api/products-count", async (req, res) => {
    // const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    const shop = req.query.shop;
    const session = shops[shop];
    console.log(Shopify.Context.API_VERSION);
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

// applyAuthMiddleware(app); // hello world


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