import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import facebookAuthRoutes from "./routes/facebookAuth.js";
import facebookCallbackRoutes from "./routes/facebookCallback.js";
import postRoutes from "./routes/posts.js";
import { runScheduler } from "./scheduler.js";

import aiRoutes from "./routes/ai.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth/facebook", facebookAuthRoutes);
app.use("/auth/facebook", facebookCallbackRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/ai", aiRoutes);

// Run scheduler every 60 seconds
setInterval(runScheduler, 60 * 1000);
runScheduler();

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});