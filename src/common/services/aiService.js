import { auth } from "@common/services/config";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated.");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const generateCaption = async ({ platform, niche, goal, tone, useEmojis, postStyle, language }) => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}/api/ai/generate-caption`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ platform, niche, goal, tone, useEmojis, postStyle, language }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to generate caption.");

  return data.caption;
};

export const saveAutopilotConfig = async (config) => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}/api/ai/automation/config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(config),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to save autopilot config.");

  return data;
};

export const generateImage = async ({ prompt }) => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}/api/ai/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) throw new Error('Image generation failed');
  const data = await res.json();
  return data.url;
};