import type { VercelRequest, VercelResponse } from '@vercel/node';
import { calculateOrderAmount, createRazorpayOrder, PaymentError } from '../server/payment.js';

const handler = async (request: VercelRequest, response: VercelResponse) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const body = request.body && typeof request.body === 'object' ? request.body : {};
    const amount = calculateOrderAmount(body.items, body.coupon_code);
    const order = await createRazorpayOrder(amount);
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