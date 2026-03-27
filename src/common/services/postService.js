import { auth } from "@common/services/config";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated.");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const schedulePost = async ({ message, imageUrl, scheduledAt, platform }) => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}/api/posts/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ message, imageUrl, scheduledAt, platform }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to schedule post.");

  return data;
};

export const fetchPosts = async () => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}/api/posts`, { headers });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to fetch posts.");

  return data.posts;
};

export const deletePost = async (postId) => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
    method: "DELETE",
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete post.");
  return data;
};

export const uploadImage = async (file) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated.');
  const token = await user.getIdToken();

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json();
  return data.url;
};

export const deleteImage = async (filename) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated.');
  const token = await user.getIdToken();

  await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filename }),
  });
};