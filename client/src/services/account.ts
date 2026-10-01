import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  type Timestamp,
} from '@firebase/firestore';
import { db } from '../firebaseData';

export type AddressLabel = 'Home' | 'Work' | 'Other';

export interface CustomerProfile {
  fullName: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  photoURL: string;
  emailUpdates: boolean;
  smsUpdates: boolean;
}

export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  label: AddressLabel;
  isDefault: boolean;
}

export interface CustomerOrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface CustomerOrder {
  id: string;
  orderId: string;
  paymentId: string;
  createdAt?: Timestamp | Date | string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  shipping?: number;
  paymentMethodDetails?: string;
  items: CustomerOrderItem[];
  customer?: { fullName: string; email: string; phone: string; address: string };
}

const userDocument = (uid: string) => doc(db, 'users', uid);
const addressCollection = (uid: string) => collection(db, 'users', uid, 'addresses');

export const getAccountDataErrorMessage = (error: unknown, action: string) => {
  const code = typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
    ? error.code
    : '';

  if (code === 'permission-denied') {
    return `Unable to ${action}: Firestore denied access. Deploy firestore.rules and confirm you are signed in with the matching Firebase project.`;
  }
  if (code === 'not-found' || code === 'failed-precondition') {
    return `Unable to ${action}: Cloud Firestore is not enabled or initialized for this Firebase project.`;
  }
  if (code === 'unavailable' || code === 'network-request-failed') {
    return `Unable to ${action}: check your network connection and try again.`;
  }
  return code ? `Unable to ${action} (${code}). Please try again.` : `Unable to ${action}. Please try again.`;
};

export const getCustomerProfile = async (uid: string, defaults: CustomerProfile) => {
  const profile = await getDoc(userDocument(uid));
  if (profile.exists()) return { ...defaults, ...profile.data() } as CustomerProfile;

  await setDoc(userDocument(uid), { ...defaults, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
  return defaults;
};

export const saveCustomerProfile = async (uid: string, profile: CustomerProfile) => {
  await setDoc(userDocument(uid), { ...profile, updatedAt: serverTimestamp() }, { merge: true });
};

export const getCustomerAddresses = async (uid: string) => {
  const addresses = await getDocs(addressCollection(uid));
  return addresses.docs
    .map((address) => ({ id: address.id, ...address.data() } as CustomerAddress))
    .sort((left, right) => Number(right.isDefault) - Number(left.isDefault));
};

export const saveCustomerAddress = async (
  uid: string,
  address: Omit<CustomerAddress, 'id'>,
  addressId?: string,
) => {
  const addressesRef = addressCollection(uid);
  const addressRef = addressId ? doc(addressesRef, addressId) : doc(addressesRef);
  const batch = writeBatch(db);

  if (address.isDefault) {
    const existingAddresses = await getDocs(addressesRef);
    existingAddresses.docs.forEach((existing) => {
      if (existing.id !== addressRef.id && existing.data().isDefault) {
        batch.update(existing.ref, { isDefault: false });
      }
    });
  }

  batch.set(addressRef, {
    ...address,
    updatedAt: serverTimestamp(),
    ...(addressId ? {} : { createdAt: serverTimestamp() }),
  }, { merge: true });
  await batch.commit();
  return addressRef.id;
};

export const setDefaultCustomerAddress = async (uid: string, addressId: string) => {
  const addresses = await getDocs(addressCollection(uid));
  const batch = writeBatch(db);
  addresses.docs.forEach((address) => {
    batch.update(address.ref, { isDefault: address.id === addressId });
  });
  await batch.commit();
};

export const deleteCustomerAddress = async (uid: string, addressId: string) => {
  const addresses = await getDocs(addressCollection(uid));
  const currentAddress = addresses.docs.find((address) => address.id === addressId);
  const nextDefault = currentAddress?.data().isDefault
    ? addresses.docs.find((address) => address.id !== addressId)
    : undefined;
  const batch = writeBatch(db);
  batch.delete(doc(addressCollection(uid), addressId));
  if (nextDefault) batch.update(nextDefault.ref, { isDefault: true });
  await batch.commit();
};

export const getCustomerOrders = async (uid: string) => {
  const ordersQuery = query(collection(db, 'users', uid, 'orders'), orderBy('createdAt', 'desc'));
  const orders = await getDocs(ordersQuery);
  return orders.docs.map((order) => ({ id: order.id, ...order.data() } as CustomerOrder));
};

export const getCustomerOrder = async (uid: string, orderId: string) => {
  const order = await getDoc(doc(db, 'users', uid, 'orders', orderId));
  return order.exists() ? ({ id: order.id, ...order.data() } as CustomerOrder) : null;
};