import { createHmac, timingSafeEqual } from 'node:crypto';
import Razorpay from 'razorpay';
import { PRODUCTS } from '../shared/data/mockData.js';

export class PaymentError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new PaymentError('Payment gateway is not configured on the server.', 500);
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

interface OrderItemInput {
  product_id: unknown;
  quantity: unknown;
}

export const calculateOrderAmount = (items: unknown, couponCode: unknown) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new PaymentError('Your cart is empty.', 400);
  }

  let subtotal = 0;
  for (const item of items as OrderItemInput[]) {
    if (
      typeof item?.product_id !== 'string' ||
      !Number.isSafeInteger(item.quantity) ||
      (item.quantity as number) < 1
    ) {
      throw new PaymentError('Cart item details are invalid.', 400);
    }

    const product = PRODUCTS.find((entry) => entry.id === item.product_id);
    const quantity = item.quantity as number;
    if (!product || !product.inStock || quantity > product.stockCount) {
      throw new PaymentError('A cart item is unavailable in the requested quantity.', 400);
    }

    subtotal += product.price * quantity;
  }

  const normalizedCoupon = typeof couponCode === 'string' ? couponCode.trim().toUpperCase() : '';
  const discountPercent = normalizedCoupon === 'TISHNAGII10' || normalizedCoupon === 'ROYAL10'
    ? 10
    : normalizedCoupon === 'BRIDAL15'
      ? 15
      : 0;
  const discount = Math.round((subtotal * discountPercent) / 100);
  const shipping = subtotal >= 1499 ? 0 : 150;
  const amount = Math.max(0, subtotal - discount + shipping) * 100;

  if (!Number.isSafeInteger(amount) || amount < 100) {
    throw new PaymentError('The minimum payment amount is ₹1.00.', 400);
  }

  return amount;
};

export const createRazorpayOrder = async (amount: number) => {
  try {
    const order = await getRazorpay().orders.create({
      amount,
      currency: 'INR',
      receipt: `tsh-${Date.now()}`,
    });

    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    if (error instanceof PaymentError) throw error;

    const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error
      && error.statusCode === 401
      ? 401
      : 500;
    throw new PaymentError(
      statusCode === 401
        ? 'Razorpay authentication failed. Check the server credentials.'
        : 'Razorpay could not create the order. Please try again.',
      statusCode,
    );
  }
};

export const verifyRazorpaySignature = (
  orderId: unknown,
  paymentId: unknown,
  signature: unknown,
) => {
  if (
    typeof orderId !== 'string' || !orderId ||
    typeof paymentId !== 'string' || !paymentId ||
    typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    throw new PaymentError('Payment verification fields are missing or invalid.', 400);
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new PaymentError('Payment gateway is not configured on the server.', 500);
  }

  const expected = createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  const receivedBuffer = Buffer.from(signature, 'hex');

  return expectedBuffer.length === receivedBuffer.length
    && timingSafeEqual(expectedBuffer, receivedBuffer);
};