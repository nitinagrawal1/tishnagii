import { createHash } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminAuth, isFirebaseAdminConfigured } from '../server/firebaseAdmin.js';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { getOrderSummary, PaymentError } from '../server/payment.js';
import { saveAccountOrder, type OrderCustomer } from '../server/orderHistory.js';

const handler = async (request: VercelRequest, response: VercelResponse) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const authorization = request.headers.authorization;
  const idToken = typeof authorization === 'string' && authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : '';
  if (!idToken) return response.status(401).json({ error: 'Sign in to save this order to your account.' });
  if (!isFirebaseAdminConfigured()) {
    return response.status(503).json({ error: 'Account order history is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON on the server.' });
  }

  let identity: DecodedIdToken;
  try {
    identity = await getAdminAuth().verifyIdToken(idToken);
  } catch {
    return response.status(401).json({ error: 'Your session expired. Sign in again to place this order.' });
  }

  try {
    const body = request.body && typeof request.body === 'object' ? request.body : {};
    if (typeof body.idempotency_key !== 'string' || !/^[a-zA-Z0-9_-]{16,80}$/.test(body.idempotency_key)) {
      return response.status(400).json({ error: 'A valid order request ID is required.' });
    }
    const summary = getOrderSummary(body.cart_items, body.coupon_code);
    const customer = body.customer as OrderCustomer | undefined;
    if (!customer || typeof customer.fullName !== 'string' || typeof customer.address !== 'string') {
      return response.status(400).json({ error: 'Customer and delivery details are required.' });
    }

    const requestHash = createHash('sha256')
      .update(`${identity.uid}:${body.idempotency_key}`)
      .digest('hex')
      .slice(0, 24);
    const orderId = `COD-${requestHash}`;
    await saveAccountOrder(identity.uid, {
      orderId,
      paymentId: '',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'confirmed',
      amount: summary.amount,
      amountPaise: summary.amountPaise,
      currency: summary.currency,
      subtotal: summary.subtotal,
      discount: summary.discount,
      tax: summary.tax,
      shipping: summary.shipping,
      items: summary.items,
      customer: {
        fullName: customer.fullName.slice(0, 120),
        email: identity.email || '',
        phone: customer.phone.slice(0, 30),
        address: customer.address.slice(0, 500),
      },
    });

    return response.status(200).json({
      order_id: orderId,
      saved: true,
      amount: summary.amount,
      amountPaise: summary.amountPaise,
      currency: summary.currency,
      subtotal: summary.subtotal,
      discount: summary.discount,
      tax: summary.tax,
      shipping: summary.shipping,
      items: summary.items,
      customer,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'confirmed',
    });
  } catch (error) {
    if (error instanceof PaymentError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('COD order could not be saved:', error);
    return response.status(500).json({ error: 'Unable to save this order to your account. Please try again.' });
  }
};

export default handler;