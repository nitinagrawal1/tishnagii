import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PaymentError, verifyRazorpaySignature } from '../server/payment';

const handler = async (request: VercelRequest, response: VercelResponse) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const body = request.body && typeof request.body === 'object' ? request.body : {};
    const verified = verifyRazorpaySignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature,
    );

    if (!verified) {
      return response.status(400).json({ error: 'Payment signature verification failed.' });
    }

    return response.status(200).json({
      verified: true,
      order_id: body.razorpay_order_id,
      payment_id: body.razorpay_payment_id,
    });
  } catch (error) {
    const status = error instanceof PaymentError ? error.statusCode : 500;
    const message = error instanceof PaymentError
      ? error.message
      : 'Unable to verify the payment.';
    return response.status(status).json({ error: message });
  }
};

export default handler;