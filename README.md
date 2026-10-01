# TISHNAGII

Artisanal jewellery storefront built with React, TypeScript, and Vite, with Firebase Authentication and Razorpay Standard Checkout.

## Project Layout

- `client/`: Vite application, static assets, and public files.
- `server/`: Payment services and the local Express development runner.
- `shared/`: Catalog data and types used by both frontend and backend.
- `api/`: Vercel serverless API routes.
- Root: package management, TypeScript, Vite, and deployment configuration.

## Local Development

1. Install dependencies with `npm install`.
2. Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `VITE_RAZORPAY_KEY_ID` in `.env`.
3. Set the Firebase web configuration in `client/src/firebase.ts`.
4. Enable Cloud Firestore in Firebase, then deploy `firestore.rules` with `firebase deploy --only firestore:rules`.
5. For local development, point `FIREBASE_SERVICE_ACCOUNT_PATH` in the ignored `.env.firebase` file to your service-account JSON. In Vercel, set the JSON itself as the server-only `FIREBASE_SERVICE_ACCOUNT_JSON` environment variable. This credential binds signed-in Razorpay orders and saves COD/verified orders; never add the service-account file to Git.
6. Start the app and local API with `npm run dev`.

The local app is available at `http://localhost:3000`. Production builds run with `npm run build` and are emitted to `client/dist`. Firebase profile and address data is scoped by authenticated user; order documents are client read-only and written by the server.
