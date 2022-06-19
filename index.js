/*
                    ██████╗░███████╗██╗░░░██╗░░░░░░░█████╗░██████╗░████████╗
                    ██╔══██╗██╔════╝██║░░░██║░░░░░░██╔══██╗██╔══██╗╚══██╔══╝
                    ██║░░██║█████╗░░╚██╗░██╔╝█████╗███████║██████╔╝░░░██║░░░
                    ██║░░██║██╔══╝░░░╚████╔╝░╚════╝██╔══██║██╔══██╗░░░██║░░░
                    ██████╔╝███████╗░░╚██╔╝░░░░░░░░██║░░██║██║░░██║░░░██║░░░
                    ╚═════╝░╚══════╝░░░╚═╝░░░░░░░░░╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░
*/
import express from 'express';
import { Shopify } from '@shopify/shopify-api';
import applyAuthMiddleware from "./middleware/auth.js";
import routerDev from "./routes/router-dev.js";
import router from "./routes/index.js";
import verifyRequest from "./middleware/verify-request.js";
const fs = await import("fs");
const log = console.log;
const port = 3000;
import { shops, context, state } from "./middleware/state.js";

const app = express();
app.use(express.json());
routerDev(app); // Dev routes
applyAuthMiddleware(app); // Auth
router(app); // Other routes


// app.post("/graphql", verifyRequest(app), async (req, res) => {
app.post("/graphql", async (req, res) => {
    try {
        const response = await Shopify.Utils.graphqlProxy(req, res);
        res.status(200).send(response.body);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/gql", async (req, res) => {
    try {
        const shop = this.req.query.shop;
        const response = await getGQL(shop, 'query')
        res.status(200).send(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

async function getGQL(shop, query) {
    const session = shops[shop];
    log('products session GQL', session);
    // Create a new client for the specified shop.
    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
    const products = await client.query({
        data: `{
            products (first: 10) {
              edges {
                node {
                  id
                  title
                  descriptionHtml
                }
              }
            }
          }`,
    });
    log(products);
    state.preparedProducts = products; // !!!!!!!!!!!
    return {
        ok: true,
        result: {
            products
        }
    }
}


import compression from 'compression';
import serveStatic from 'serve-static';
import { resolve } from "path";

app.use(compression());
app.use(serveStatic(resolve("app-front/dist")));
// Client-side routing will pick up on the correct route to render, 
// so we always render the index here
app.use("/*", (req, res, next) => {
    res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/app-front/dist/index.html`));
});


app.listen(process.env.PORT || port, () => { log(`Server running at ${port}`) });