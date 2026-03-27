import { adminDb } from "./firebaseAdmin.js";

const publishToFacebook = async (pageId, pageToken, message, imageUrl) => {
  // If there's an image, upload it first then attach to post
  if (imageUrl) {
    const photoRes = await fetch(
      `https://graph.facebook.com/v23.0/${pageId}/photos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: imageUrl,
          caption: message,
          access_token: pageToken,
          published: true,
        }),
      }
    );

    const photoData = await photoRes.json();

    if (photoData.error) {
      throw new Error(photoData.error.message);
    }

    return photoData;
  }

  // Text-only post
  const res = await fetch(
    `https://graph.facebook.com/v23.0/${pageId}/feed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        access_token: pageToken,
      }),
    }
  );

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data;
};

export const runScheduler = async () => {
  const now = new Date();

  try {
    // Find all pending posts whose scheduledAt time has passed
    const snapshot = await adminDb
      .collection("scheduledPosts")
      .where("status", "==", "pending")
      .where("scheduledAt", "<=", now)
      .get();

    if (snapshot.empty) return;

    console.log(`Scheduler: found ${snapshot.docs.length} post(s) to publish`);

    const jobs = snapshot.docs.map(async (docSnap) => {
      const post = docSnap.data();
      const ref = docSnap.ref;

      try {
        // Mark as processing immediately to prevent double-publish
        await ref.update({ status: "processing" });
        console.log(`Scheduler: post ${docSnap.id} imageUrl:`, post.imageUrl);


        await publishToFacebook(
          post.pageId,
          post.pageToken,
          post.message,
          post.imageUrl ? `${process.env.SERVER_BASE_URL}${post.imageUrl}` : null
        );

        await ref.update({
          status: "published",
          publishedAt: new Date(),
          error: null,
        });

        console.log(`Scheduler: published post ${docSnap.id}`);
      } catch (err) {
        console.error(`Scheduler: failed post ${docSnap.id}:`, err.message);

        await ref.update({
          status: "failed",
          error: err.message,
        });
      }
    });

    await Promise.allSettled(jobs);
  } catch (err) {
    console.error("Scheduler run error:", err);
  }
};