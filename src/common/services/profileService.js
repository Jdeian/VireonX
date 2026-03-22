import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@common/services/config';

const USERS_COLLECTION = 'users';

export const getProfile = async (uid) => {
  if (!uid) throw new Error('User ID is required.');

  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
};

export const saveOnboardingProfile = async (uid, formData) => {
  if (!uid) throw new Error('User ID is required.');

  const ref = doc(db, USERS_COLLECTION, uid);
  const existingProfile = await getDoc(ref);

  const payload = {
    fullName: formData.fullName?.trim() || '',
    accountType: formData.accountType || 'personal',
    accountRole: formData.accountRole?.trim() || '',
    niche: formData.niche?.trim() || '',
    bio: formData.bio?.trim() || '',
    goal: formData.goal || '',
    platforms: Array.isArray(formData.platforms) ? formData.platforms : [],
    connectedAccounts: {
      facebook: !!formData.connectedAccounts?.facebook,
      instagram: !!formData.connectedAccounts?.instagram,
      twitter: !!formData.connectedAccounts?.twitter,
      linkedin: !!formData.connectedAccounts?.linkedin,
    },
    tone: formData.tone || '',
    useEmojis: formData.useEmojis ?? false,
    postStyle: formData.postStyle || '',
    language: formData.language || 'English',
    onboardingCompleted: true,
    updatedAt: serverTimestamp(),
  };

  if (!existingProfile.exists()) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(ref, payload, { merge: true });
};

export const updateProfile = async (uid, updates) => {
  if (!uid) throw new Error('User ID is required.');

  const ref = doc(db, USERS_COLLECTION, uid);

  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const completeOnboarding = async (uid) => {
  if (!uid) throw new Error('User ID is required.');

  const ref = doc(db, USERS_COLLECTION, uid);

  await updateDoc(ref, {
    onboardingCompleted: true,
    updatedAt: serverTimestamp(),
  });
};

export const hasCompletedOnboarding = async (uid) => {
  const profile = await getProfile(uid);
  return !!profile?.onboardingCompleted;
};