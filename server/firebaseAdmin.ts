import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';

const adminAppName = 'tishnagii-account-admin';

export const isFirebaseAdminConfigured = () =>
  Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

const getAdminApp = () => {
  const existingApp = getApps().find((app) => app.name === adminAppName);
  if (existingApp) return existingApp;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    || (process.env.FIREBASE_SERVICE_ACCOUNT_PATH
      ? readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8')
      : '');
  if (!serviceAccountJson) {
    throw new Error('Configure FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH for server-side Firebase Admin access.');
  }

  const serviceAccount = JSON.parse(serviceAccountJson) as {
    project_id: string;
    client_email: string;
    private_key: string;
  };
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  return initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  }, adminAppName);
};

export const getAdminAuth = () => getAuth(getAdminApp());
export const getAdminFirestore = () => getFirestore(getAdminApp());