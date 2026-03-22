import express from "express";
import crypto from "crypto";

const router = express.Router();

router.get("/start", async (req, res) => {
  try {
    const { token, returnTo } = req.query;

    if (!token) {
      return res.status(400).send("Missing Firebase token.");
    }

    const state = crypto.randomBytes(16).toString("hex");

    global.facebookOAuthStates = global.facebookOAuthStates || {};
    global.facebookOAuthStates[state] = {
      token,
      returnTo: returnTo || import.meta.env.FRONTEND_URL,
    };

    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
      state,
      config_id: process.env.FACEBOOK_CONFIG_ID,
      response_type: "code",
      scope: "pages_show_list,pages_read_engagement,pages_manage_posts",
    });

    return res.redirect(
      `https://www.facebook.com/v23.0/dialog/oauth?${params.toString()}`
    );
  } catch (error) {
    console.error("Facebook start error:", error);
    return res.status(500).send("Failed to start Facebook OAuth.");
  }
});

export default router;