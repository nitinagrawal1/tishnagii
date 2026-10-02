import { FirebaseError, getApps, initializeApp } from '@firebase/app';
import {
  browserPopupRedirectResolver,
  browserLocalPersistence,
  getAuth,
  initializeAuth,
} from '@firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'auth/already-initialized') {
      return getAuth(app);
    }
    throw error;
  }
})();

export const getAuthErrorMessage = (error: unknown) => {
  const code = typeof error === 'object' && error !== null && 'code' in error
    && typeof error.code === 'string'
    ? error.code
    : '';

  switch (code) {
    case 'auth/invalid-api-key':
    case 'auth/app-not-authorized':
      return 'Firebase rejected this app configuration. Please contact support.';
    case 'auth/unauthorized-domain':
      return 'This website domain is not authorized for sign-in. Add it in Firebase Authentication settings.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'The email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email. Try signing in.';
    case 'auth/weak-password':
    case 'auth/password-does-not-meet-requirements':
      return 'Choose a stronger password with at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'The Google sign-in window was closed before finishing.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in window. Allow pop-ups and try again.';
    case 'auth/cancelled-popup-request':
      return 'Another Google sign-in window is already open. Finish it or try again.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is currently unavailable.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a little and try again.';
    case 'auth/network-request-failed':
      return 'A network error interrupted sign-in. Check your connection and try again.';
    case 'auth/web-storage-unsupported':
    case 'auth/unsupported-persistence-type':
    case 'auth/persistence-not-supported':
      return 'Your browser is blocking saved sessions. Enable site storage and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    default:
      return code
        ? `Authentication failed (${code}). Please try again or contact support.`
        : 'We could not complete that request. Please check your connection and try again.';
  }
};