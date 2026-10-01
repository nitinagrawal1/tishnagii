import { FieldValue } from 'firebase-admin/firestore';
import { getAdminFirestore } from './firebaseAdmin.js';

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface AccountOrderRecord {
  orderId: string;
  paymentId: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  amount: number;
  amountPaise: number;
  currency: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  paymentMethodDetails?: string;
  items: Array<{
    productId: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  customer: OrderCustomer;
}

export const saveAccountOrder = async (uid: string, order: AccountOrderRecord) => {
  const orderRef = getAdminFirestore()
    .collection('users')
    .doc(uid)
    .collection('orders')
    .doc(order.orderId);

  return getAdminFirestore().runTransaction(async (transaction) => {
    const existing = await transaction.get(orderRef);
    if (existing.exists) {
      const savedOrder = existing.data();
      if (
        savedOrder?.paymentMethod === order.paymentMethod &&
        savedOrder?.paymentId === order.paymentId
      ) return false;
      throw new Error('An order with this ID is already saved.');
    }

    transaction.create(orderRef, { ...order, createdAt: FieldValue.serverTimestamp() });
    return true;
  });
};