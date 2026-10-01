import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getOrderSummary,
  getRazorpayClient,
  PaymentError,
  verifyRazorpaySignature,
} from '../server/payment.js';
import { getAdminAuth, isFirebaseAdminConfigured } from '../server/firebaseAdmin.js';
import { saveAccountOrder, type OrderCustomer } from '../server/orderHistory.js';

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

    const bodyCart = getOrderSummary(body.cart_items, body.coupon_code);
    const razorpay = getRazorpayClient();
    const [order, payment] = await Promise.all([
      razorpay.orders.fetch(body.razorpay_order_id),
      razorpay.payments.fetch(body.razorpay_payment_id),
    ]);
    if (
      order.amount !== bodyCart.amountPaise ||
      order.currency !== bodyCart.currency ||
      payment.order_id !== order.id ||
      payment.amount !== order.amount ||
      payment.currency !== order.currency ||
      !['captured', 'authorized'].includes(payment.status)
    ) {
      return response.status(400).json({ error: 'Payment details do not match the verified order.' });
    }

    let historySaved = false;
    let historyMessage: string | undefined;
    const authorization = request.headers.authorization;
    const idToken = typeof authorization === 'string' && authorization.startsWith('Bearer ')
      ? authorization.slice(7)
      : '';

    if (idToken) {
      if (!isFirebaseAdminConfigured()) {
        historyMessage = 'Payment verified, but order history is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON on the server.';
      } else {
      try {
        const identity = await getAdminAuth().verifyIdToken(idToken);
        if (order.notes?.customer_uid !== identity.uid) {
          throw new Error('This Razorpay order is not linked to the signed-in account.');
        }
        const customer = body.customer as OrderCustomer;
        if (!customer || typeof customer.fullName !== 'string' || typeof customer.address !== 'string') {
          throw new Error('Customer details are missing from the order.');
        }
        await saveAccountOrder(identity.uid, {
          orderId: order.id,
          paymentId: payment.id,
          paymentMethod: payment.method,
          paymentStatus: payment.status,
          status: payment.status === 'captured' ? 'confirmed' : 'payment_authorized',
          amount: bodyCart.amount,
          amountPaise: bodyCart.amountPaise,
          currency: order.currency,
          subtotal: bodyCart.subtotal,
          discount: bodyCart.discount,
          tax: bodyCart.tax,
          shipping: bodyCart.shipping,
          paymentMethodDetails: payment.method === 'card' ? payment.card?.network : undefined,
          items: bodyCart.items,
          customer: {
            fullName: customer.fullName.slice(0, 120),
            email: identity.email || '',
            phone: customer.phone.slice(0, 30),
            address: customer.address.slice(0, 500),
          },
        });
        historySaved = true;
      } catch (error) {
        console.error('Verified payment could not be added to account history:', error);
        historyMessage = 'Payment was verified, but order history could not be synchronized.';
      }
      }
    }

    return response.status(200).json({
      verified: true,
      order_id: body.razorpay_order_id,
      payment_id: body.razorpay_payment_id,
      amount: order.amount / 100,
      amountPaise: order.amount,
      currency: order.currency,
      subtotal: bodyCart.subtotal,
      discount: bodyCart.discount,
      tax: bodyCart.tax,
      shipping: bodyCart.shipping,
      items: bodyCart.items,
      customer: body.customer,
      paymentMethod: payment.method,
      paymentMethodDetails: payment.method === 'card' ? payment.card?.network : undefined,
      paymentStatus: payment.status,
      status: payment.status === 'captured' ? 'confirmed' : 'payment_authorized',
      historySaved,
      historyMessage,
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