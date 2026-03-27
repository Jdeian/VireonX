import express from "express";
import OpenAI from "openai";
import fs from 'fs';
import path from 'path';
import { adminAuth, adminDb } from "../firebaseAdmin.js";

const router = express.Router();
const openai = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Token limits per platform
const maxTokensMap = {
  facebook: 120,  // 90 words
  instagram: 80,  // 60 words
  twitter: 60,    // 45 words
  linkedin: 100, // 75 words
};

// Short platform guide
const platformGuide = {
  facebook: "Facebook post (2-3 sentences, 1-2 hashtags max)",
  instagram: "Instagram caption (1-2 punchy sentences, 2-3 relevant hashtags at the end)",
  twitter: "Tweet (under 220 characters, 1-2 hashtags max)",
  linkedin: "LinkedIn post (1-2 sentences, 1-2 hashtags max)",
};

const platformBannedContext = {
  facebook: "Avoid: spam-like language, excessive punctuation, misleading claims, engagement bait phrases like 'Comment YES if', 'Share to win', 'Tag 3 friends'.",
  instagram: "Avoid: follow-for-follow language, comment pods, buying followers references, misleading hashtags, excessive hashtag spam.",
  twitter: "Avoid: follow-back requests, retweet-to-win schemes, misleading trending hashtags, coordinated inauthentic behavior language.",
  linkedin: "Avoid: fake urgency, exaggerated income claims, pyramid scheme language, unsolicited sales pitches, fabricated credentials.",
};

// POST /api/ai/generate-caption
router.post("/generate-caption", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const idToken = authHeader.split("Bearer ")[1];
    await adminAuth.verifyIdToken(idToken);

    const { platform, niche, goal, tone, useEmojis, postStyle, language } = req.body;

    if (!platform || !niche) {
      return res.status(400).json({ error: "Platform and niche are required." });
    }

    // Sanitize and truncate inputs to prevent prompt inflation
    const safePlatform = String(platform).slice(0, 20);
    const safeNiche = String(niche).slice(0, 60);
    const safeGoal = String(goal || "").slice(0, 80);
    const safeTone = String(tone || "").slice(0, 40);
    const safeUseEmojis = useEmojis === true;
    const safePostStyle = String(postStyle || '').slice(0, 40);
    const safeLanguage = String(language || 'English').slice(0, 30);

    // Short, directive prompt — minimal tokens
    const prompt = `Write a ${platformGuide[safePlatform] || safePlatform} about ${safeNiche}.
    Goal: ${safeGoal || "engage the audience"}.
    Tone: ${safeTone || "friendly"}.
    Style: ${safePostStyle || "conversational"}.
    Language: ${safeLanguage}.
    Emojis: ${safeUseEmojis ? "yes, use relevant emojis naturally" : "no emojis at all"}.
    Platform rules: ${platformBannedContext[safePlatform] || "Follow standard community guidelines."}.
    Rules: No filler phrases. Write like a real person. Return only the post text. No quotes. No explanation.`;

    const completion = await openai().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokensMap[safePlatform] || 100,
      temperature: 0.8,
    });

    const caption = completion.choices[0]?.message?.content?.trim();

    if (!caption) {
      return res.status(500).json({ error: "Failed to generate caption." });
    }

    return res.json({ caption });
  } catch (err) {
    console.error("Generate caption error:", err);
    return res.status(500).json({ error: "Failed to generate caption." });
  }
});

// GET /api/ai/automation/pending-slots
router.get("/automation/pending-slots", async (req, res) => {
  const secret = req.headers["x-scheduler-secret"];

  if (secret !== process.env.SCHEDULER_SECRET) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const snapshot = await adminDb
      .collection("autopilotConfigs")
      .where("enabled", "==", true)
      .get();

    if (snapshot.empty) {
      return res.json({ slots: [] });
    }

    const now = new Date();
    const slots = [];

    for (const doc of snapshot.docs) {
      const config = doc.data();
      const lastGenerated = config.lastGeneratedAt?.toDate?.() || new Date(0);
      const intervalMs = getIntervalMs(config.frequency);

      if (now - lastGenerated >= intervalMs) {
        slots.push({
          uid: doc.id,
          platform: config.platform,
          // Truncate stored values too in case they were saved without limits
          niche: String(config.niche || "").slice(0, 60),
          goal: String(config.goal || "").slice(0, 80),
          tone: String(config.tone || "professional but friendly").slice(0, 40),
          scheduledAt: new Date(now.getTime() + 60000).toISOString(),
        });
      }
    }

    return res.json({ slots });
  } catch (err) {
    console.error("Pending slots error:", err);
    return res.status(500).json({ error: "Failed to fetch pending slots." });
  }
});

// POST /api/ai/automation/mark-generated
router.post("/automation/mark-generated", async (req, res) => {
  const secret = req.headers["x-scheduler-secret"];

  if (secret !== process.env.SCHEDULER_SECRET) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const { uid } = req.body;

    await adminDb.collection("autopilotConfigs").doc(uid).update({
      lastGeneratedAt: new Date(),
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Mark generated error:", err);
    return res.status(500).json({ error: "Failed to mark generated." });
  }
});

// POST /api/ai/automation/config
router.post("/automation/config", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const { enabled, platform, niche, frequency, postsPerPeriod, goal, tone } = req.body;

    // Sanitize before saving to Firestore
    await adminDb.collection("autopilotConfigs").doc(uid).set({
      enabled,
      platform: String(platform || "").slice(0, 20),
      niche: String(niche || "").slice(0, 60),
      frequency,
      postsPerPeriod,
      goal: String(goal || "").slice(0, 80),
      tone: String(tone || "professional but friendly").slice(0, 40),
      updatedAt: new Date(),
      lastGeneratedAt: enabled ? null : new Date(),
    }, { merge: true });

    return res.json({ success: true });
  } catch (err) {
    console.error("Autopilot config error:", err);
    return res.status(500).json({ error: "Failed to save autopilot config." });
  }
});

// POST /api/ai/generate-image
router.post('/generate-image', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
  } catch {
    return res.status(401).json({ error: 'Invalid token.' });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );


    if (!response.ok) {
      return res.status(500).json({ error: 'Image generation failed' });
    }

    const buffer = await response.arrayBuffer();

    const filename = `ai-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    const uploadsDir = path.resolve('uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(buffer));

    res.json({ url: `/uploads/${filename}` });
  } catch (err) {
    res.status(500).json({ error: 'Image generation failed' });
  }
});

const getIntervalMs = (frequency) => {
  switch (frequency) {
    case "day": return 24 * 60 * 60 * 1000;
    case "week": return 7 * 24 * 60 * 60 * 1000;
    case "month": return 30 * 24 * 60 * 60 * 1000;
    default: return 24 * 60 * 60 * 1000;
  }
};

export default router;