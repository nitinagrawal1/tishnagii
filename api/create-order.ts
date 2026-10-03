import type { VercelRequest, VercelResponse } from '@vercel/node';
import { calculateOrderAmount, createRazorpayOrder, PaymentError } from '../server/payment.js';
import { getAdminAuth, isFirebaseAdminConfigured } from '../server/firebaseAdmin.js';

const handler = async (request: VercelRequest, response: VercelResponse) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const authorization = request.headers.authorization;
  const idToken = typeof authorization === 'string' && authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : '';
  if (!idToken) {
    return response.status(401).json({ error: 'Sign in or create an account before placing an order.' });
  }
  if (!isFirebaseAdminConfigured()) {
    return response.status(503).json({ error: 'Authenticated checkout is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON on the server.' });
  }
  let customerUid: string;
  try {
    customerUid = (await getAdminAuth().verifyIdToken(idToken)).uid;
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
    if (code.startsWith('auth/')) {
      return response.status(401).json({ error: 'Your sign-in session expired. Please sign in again.' });
    }
    console.error('Unable to verify customer for Razorpay order:', error);
    return response.status(500).json({ error: 'Unable to prepare your account order. Please try again.' });
  }

  try {
    const body = request.body && typeof request.body === 'object' ? request.body : {};
    const amount = calculateOrderAmount(body.items, body.coupon_code);
    const order = await createRazorpayOrder(amount, customerUid);
    return response.status(200).json(order);
  } catch (error) {
    const status = error instanceof PaymentError ? error.statusCode : 500;
    const message = error instanceof PaymentError
      ? error.message
      : 'Unable to create a payment order.';
    return response.status(status).json({ error: message });
  }
};

export default handler;