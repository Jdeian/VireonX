import express from "express";
import { adminAuth, adminDb } from "../firebaseAdmin.js";

const router = express.Router();

// POST /api/posts/schedule
router.post("/schedule", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const { message, imageUrl, scheduledAt, platform } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Post message is required." });
    }

    if (!scheduledAt) {
      return res.status(400).json({ error: "Scheduled time is required." });
    }

    if (!platform) {
      return res.status(400).json({ error: "Platform is required." });
    }

    // Get the user's saved page token from Firestore
    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (!userData?.socialTokens?.facebook?.pageToken) {
      return res.status(400).json({
        error: "No Facebook Page connected. Please connect your Page first.",
      });
    }

    if (!userData?.facebookPageId) {
      return res.status(400).json({
        error: "No Facebook Page ID found.",
      });
    }

    // Save the scheduled post to Firestore
    const postRef = await adminDb.collection("scheduledPosts").add({
      uid,
      platform,
      message: message.trim(),
      imageUrl: imageUrl || null,
      pageId: userData.facebookPageId,
      pageName: userData.facebookPageName,
      // We never expose the token to the frontend — kept server-side only
      pageToken: userData.socialTokens.facebook.pageToken,
      scheduledAt: new Date(scheduledAt),
      status: "pending",       // pending → published or failed
      createdAt: new Date(),
      publishedAt: null,
      error: null,
    });

    return res.status(201).json({
      success: true,
      postId: postRef.id,
      message: "Post scheduled successfully.",
    });
  } catch (err) {
    console.error("Schedule post error:", err);
    return res.status(500).json({ error: "Failed to schedule post." });
  }
});

// GET /api/posts — fetch all posts for the logged-in user
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const snapshot = await adminDb
      .collection("scheduledPosts")
      .where("uid", "==", uid)
      .orderBy("scheduledAt", "desc")
      .get();

    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        platform: data.platform,
        message: data.message,
        imageUrl: data.imageUrl,
        pageName: data.pageName,
        scheduledAt: data.scheduledAt?.toDate?.()?.toISOString(),
        publishedAt: data.publishedAt?.toDate?.()?.toISOString() || null,
        status: data.status,
        error: data.error || null,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
      };
      // ↑ Never return pageToken to the frontend
    });

    return res.json({ posts });
  } catch (err) {
    console.error("Fetch posts error:", err);
    return res.status(500).json({ error: "Failed to fetch posts." });
  }
});

router.post("/process-pending", async (req, res) => {
  const secret = req.headers["x-scheduler-secret"];

  if (secret !== process.env.SCHEDULER_SECRET) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const now = new Date();

    const snapshot = await adminDb
      .collection("scheduledPosts")
      .where("status", "==", "pending")
      .where("scheduledAt", "<=", now)
      .get();

    if (snapshot.empty) {
      return res.json({ processed: 0, message: "No pending posts." });
    }

    const results = [];

    for (const docSnap of snapshot.docs) {
      const post = docSnap.data();
      const ref = docSnap.ref;

      try {
        await ref.update({ status: "processing" });

        let fbEndpoint = `https://graph.facebook.com/v23.0/${post.pageId}/feed`;
        let fbBody = {
          message: post.message,
          access_token: post.pageToken,
        };

        // If post has an image, use the photos endpoint instead
        if (post.imageUrl) {
          const fullImageUrl = `${process.env.SERVER_BASE_URL}${post.imageUrl}`;
          fbEndpoint = `https://graph.facebook.com/v23.0/${post.pageId}/photos`;
          fbBody = {
            caption: post.message,
            url: fullImageUrl,
            access_token: post.pageToken,
          };
        }

        const fbRes = await fetch(fbEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fbBody),
        });

        const fbData = await fbRes.json();

        if (fbData.error) throw new Error(fbData.error.message);

        await ref.update({
          status: "published",
          publishedAt: new Date(),
          error: null,
        });

        results.push({ id: docSnap.id, status: "published" });
      } catch (err) {
        await ref.update({ status: "failed", error: err.message });
        results.push({ id: docSnap.id, status: "failed", error: err.message });
      }
    }

    return res.json({ processed: results.length, results });
  } catch (err) {
    console.error("Process pending error:", err);
    return res.status(500).json({ error: "Failed to process pending posts." });
  }
});

// DELETE /api/posts/:id
router.delete("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const { id } = req.params;

    const docRef = adminDb.collection("scheduledPosts").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Ownership check — users can only delete their own posts
    if (docSnap.data().uid !== uid) {
      return res.status(403).json({ error: "Forbidden." });
    }

    await docRef.delete();

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete post error:", err);
    return res.status(500).json({ error: "Failed to delete post." });
  }
});

export default router;