import express from "express";
import { adminAuth, adminDb } from "../firebaseAdmin.js";

const router = express.Router();

router.get("/callback", async (req, res) => {
  const { code, state, error, error_message } = req.query;

  const stateData = global.facebookOAuthStates?.[state];
  const returnTo = stateData?.returnTo || process.env.FRONTEND_URL;

  // Always clean up used state
  if (state && global.facebookOAuthStates?.[state]) {
    delete global.facebookOAuthStates[state];
  }

  if (error) {
    return res.redirect(
      `${returnTo}?facebook=error&message=${encodeURIComponent(
        error_message || "Authorization failed"
      )}`
    );
  }

  if (!code || !stateData) {
    return res.redirect(
      `${returnTo}?facebook=error&message=${encodeURIComponent(
        "Invalid OAuth callback."
      )}`
    );
  }

  try {
    // Step 1: Verify the Firebase user
    const decoded = await adminAuth.verifyIdToken(stateData.token);
    const uid = decoded.uid;

    // Step 2: Exchange the code for a short-lived user access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v23.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
          code,
        })
    );

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error("Facebook token exchange error:", tokenData.error);
      return res.redirect(
        `${returnTo}?facebook=error&message=${encodeURIComponent(
          "Failed to get Facebook access token."
        )}`
      );
    }

    const shortLivedToken = tokenData.access_token;

    // Step 3: Exchange for a long-lived user access token (60 days)
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v23.0/oauth/access_token?` +
        new URLSearchParams({
          grant_type: "fb_exchange_token",
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          fb_exchange_token: shortLivedToken,
        })
    );

    const longTokenData = await longTokenRes.json();

    if (longTokenData.error) {
      console.error("Facebook long token error:", longTokenData.error);
      return res.redirect(
        `${returnTo}?facebook=error&message=${encodeURIComponent(
          "Failed to extend Facebook token."
        )}`
      );
    }

    const longLivedToken = longTokenData.access_token;

    // Step 4: Get the user's Facebook Pages and their permanent page tokens
    const pagesRes = await fetch(
      `https://graph.facebook.com/v23.0/me/accounts?access_token=${longLivedToken}`
    );

    const pagesData = await pagesRes.json();

    // Log the full response so you can see what's actually coming back
    console.log("Facebook pages response:", JSON.stringify(pagesData, null, 2));

    if (pagesData.error || !pagesData.data?.length) {
      return res.redirect(
        `${returnTo}?facebook=error&message=${encodeURIComponent(
          "No Facebook Pages found. Please make sure you manage at least one Page."
        )}`
      );
    }

    // Use the first page (you can later let users pick)
    const page = pagesData.data[0];
    const pageToken = page.access_token; // This is a permanent page token
    const pageId = page.id;
    const pageName = page.name;

    // Step 5: Save everything to Firestore under users/{uid}
    // Page tokens for Pages do NOT expire — safe to store
    await adminDb.collection("users").doc(uid).set(
      {
        // Only token data — no connectedAccounts boolean, no profile fields
        socialTokens: {
          facebook: {
            pageToken,
            pageId,
            pageName,
            connectedAt: new Date().toISOString(),
          },
        },
        facebookPageId: pageId,
        facebookPageName: pageName,
        updatedAt: new Date().toISOString(),
      },
      { merge: true } // merge:true so it doesn't wipe existing profile data
    );

    return res.redirect(
      `${returnTo}?facebook=success&pageId=${encodeURIComponent(
        pageId
      )}&pageName=${encodeURIComponent(pageName)}`
    );
  } catch (err) {
    console.error("Facebook callback error:", err);
    return res.redirect(
      `${process.env.FRONTEND_URL}?facebook=error&message=${encodeURIComponent(
        "Facebook connection failed."
      )}`
    );
  }
});

export default router;