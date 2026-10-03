import React, { useEffect, useState } from 'react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { OrderInvoice } from '../components/common/OrderInvoice';
import { useShop } from '../context/ShopContext';
import { getCustomerOrder, type CustomerOrder } from '../services/account';
import { handleInternalLinkClick } from '../utils/navigation';

interface OrderSuccessPageProps {
  orderId: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId }) => {
  const { user, authLoading, lastOrder, navigateTo } = useShop();
  const [order, setOrder] = useState<CustomerOrder | null>(
    lastOrder?.orderId === orderId ? lastOrder : null,
  );
  const [isLoading, setIsLoading] = useState(!order && Boolean(user));

  useEffect(() => {
    if (lastOrder?.orderId === orderId) {
      setOrder(lastOrder);
      setIsLoading(false);
      return;
    }
    if (!user || authLoading || !orderId) {
      setIsLoading(false);
      return;
    }

    let isCurrent = true;
    setIsLoading(true);
    void getCustomerOrder(user.uid, orderId)
      .then((savedOrder) => { if (isCurrent) setOrder(savedOrder); })
      .catch(() => { if (isCurrent) setOrder(null); })
      .finally(() => { if (isCurrent) setIsLoading(false); });
    return () => { isCurrent = false; };
  }, [authLoading, lastOrder, orderId, user]);

  if (isLoading || authLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-24 text-center text-sm text-[#4A1525]/70" role="status">Loading your order…</div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-[#C49A45]" />
        <h1 className="mt-4 font-serif text-3xl text-[#2A0814]">Order details unavailable</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#4A1525]/70">Sign in to view a saved order, or return to the collection.</p>
        <a
          href={user ? '/account' : '/shop'}
          onClick={(event) => handleInternalLinkClick(event, () => navigateTo(user ? 'account' : 'shop'))}
          className="mt-6 inline-flex min-h-11 items-center bg-[#2A0814] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2]"
        >
          {user ? 'My Account' : 'Continue Shopping'}
        </a>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex items-start gap-4 border-b border-[#EADBCE] pb-6">
        <CheckCircle2 className="mt-1 h-8 w-8 shrink-0 text-emerald-800" />
        <div>
          <h1 className="font-serif text-3xl text-[#2A0814]">Thank you, {order.customer?.fullName || 'your order is confirmed'}</h1>
          <p className="mt-1 text-sm text-[#4A1525]/70">Order {order.orderId} · {order.status.replaceAll('_', ' ')}</p>
        </div>
      </header>
      <OrderInvoice order={order} />
      <div className="no-print text-center">
        <a
          href="/shop"
          onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop'))}
          className="inline-flex min-h-11 items-center text-sm text-[#2A0814] underline underline-offset-4"
        >
          Continue browsing the collection
        </a>
      </div>
    </section>
  );
};