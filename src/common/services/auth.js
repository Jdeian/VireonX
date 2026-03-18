import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from './config';

// Sign up with email and password
export const signUpWithEmail = async ({ email, password }) => {
  const cleanEmail = email.trim();

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    cleanEmail,
    password
  );

  return userCredential.user;
};

// Login with email and password
export const loginWithEmail = async ({ email, password }) => {
  const cleanEmail = email.trim();
  const userCredential = await signInWithEmailAndPassword(
    auth,
    cleanEmail,
    password
  );
  return userCredential.user;
};

// Continue with Google Sign-in
export const continueWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

// Logout user
export const logoutUser = async () => {
  await signOut(auth);
};

// Firebase error handling
export const getFirebaseErrorMessage = (error) => {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-not-found':
      return 'No account found for that email.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was closed before finishing.';
    case 'auth/popup-blocked':
      return 'The Google sign-in popup was blocked by your browser.';
    case 'auth/account-exists-with-different-credential':
      return 'This email already exists with another sign-in method.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    default:
      return error?.message || 'Something went wrong. Please try again.';
  }
};