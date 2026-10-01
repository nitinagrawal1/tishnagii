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
4. Start the app and local API with `npm run dev`.

The local app is available at `http://localhost:3000`. Production builds run with `npm run build` and are emitted to `client/dist`.
