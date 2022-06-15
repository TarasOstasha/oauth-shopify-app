import { Shopify } from "@shopify/shopify-api";
import topLevelAuthRedirect from "../helpers/top-level-auth-redirect.js";

import state from "./state.js";
const shops = state.shops;
const ACTIVE_SHOPIFY_SHOPS = state.ACTIVE_SHOPIFY_SHOPS;

export default function applyAuthMiddleware(app) {

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

}
