import React, { useState } from 'react';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import type { CustomerOrder } from '../../services/account';

interface OrderInvoiceProps {
  order: CustomerOrder;
  onBack?: () => void;
}

const formatDate = (value: CustomerOrder['createdAt']) => {
  if (!value) return 'Date unavailable';
  const date = typeof value === 'string'
    ? new Date(value)
    : value instanceof Date
      ? value
      : 'toDate' in value && typeof value.toDate === 'function'
        ? value.toDate()
        : new Date();
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const formatAmount = (amount: number, currency: string) =>
  `${currency || 'INR'} ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const paymentMethodLabel = (method: string, details?: string) => {
  const labels: Record<string, string> = {
    upi: 'UPI',
    card: details ? `Card (${details})` : 'Card',
    netbanking: 'Net Banking',
    wallet: 'Wallet',
    cod: 'Cash on Delivery',
  };
  return labels[method?.toLowerCase()] || method || 'Not available';
};

export const OrderInvoice: React.FC<OrderInvoiceProps> = ({ order, onBack }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const currency = order.currency || 'INR';
  const customer = order.customer;
  const invoiceDate = formatDate(order.createdAt);
  const subtotal = order.subtotal ?? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = order.discount ?? 0;
  const tax = order.tax ?? 0;
  const shipping = order.shipping ?? Math.max(0, order.amount - subtotal + discount - tax);
  const amount = order.amount ?? subtotal - discount + tax + shipping;

  const downloadInvoice = async () => {
    setIsDownloading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
      const left = 18;
      const right = 192;
      let y = 20;
      const ensureSpace = (height: number) => {
        if (y + height > 278) {
          pdf.addPage();
          y = 20;
        }
      };
      const labelValue = (label: string, value: string, bold = false) => {
        ensureSpace(8);
        pdf.setFont('helvetica', bold ? 'bold' : 'normal');
        pdf.text(label, left, y);
        const lines = pdf.splitTextToSize(value || '-', 100);
        pdf.text(lines, right, y, { align: 'right' });
        y += Math.max(7, lines.length * 5);
      };

      pdf.setTextColor(42, 8, 20);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('TISHNAGII', left, y);
      pdf.setFontSize(10);
      pdf.setTextColor(167, 126, 44);
      pdf.text('ARTISANAL JEWELLERY', right, y, { align: 'right' });
      y += 12;
      pdf.setDrawColor(196, 154, 69);
      pdf.line(left, y, right, y);
      y += 10;

      pdf.setTextColor(42, 8, 20);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('ORDER INVOICE', left, y);
      y += 10;
      pdf.setFontSize(9);
      labelValue('Invoice date', invoiceDate);
      labelValue('Order ID', order.orderId);
      labelValue('Payment status', order.paymentStatus.toUpperCase());
      labelValue('Order status', order.status.replaceAll('_', ' ').toUpperCase());
      labelValue('Payment method', paymentMethodLabel(order.paymentMethod, order.paymentMethodDetails));
      if (order.paymentId) labelValue('Razorpay Payment ID', order.paymentId);

      y += 3;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text('CUSTOMER & SHIPPING', left, y);
      y += 7;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      for (const value of [customer?.fullName, customer?.email, customer?.phone, customer?.address]) {
        if (!value) continue;
        ensureSpace(10);
        const lines = pdf.splitTextToSize(value, right - left);
        pdf.text(lines, left, y);
        y += Math.max(6, lines.length * 5);
      }

      y += 4;
      ensureSpace(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ITEM', left, y);
      pdf.text('QTY', 136, y, { align: 'right' });
      pdf.text('UNIT', 164, y, { align: 'right' });
      pdf.text('TOTAL', right, y, { align: 'right' });
      y += 4;
      pdf.setDrawColor(220, 205, 188);
      pdf.line(left, y, right, y);
      y += 6;

      pdf.setFont('helvetica', 'normal');
      for (const item of order.items) {
        ensureSpace(12);
        const lines = pdf.splitTextToSize(item.name, 90);
        pdf.text(lines, left, y);
        pdf.text(String(item.quantity), 136, y, { align: 'right' });
        pdf.text(formatAmount(item.price, currency), 164, y, { align: 'right' });
        pdf.text(formatAmount(item.price * item.quantity, currency), right, y, { align: 'right' });
        y += Math.max(8, lines.length * 5);
      }

      y += 3;
      pdf.line(left, y, right, y);
      y += 8;
      labelValue('Subtotal', formatAmount(subtotal, currency));
      labelValue('Discount', `- ${formatAmount(discount, currency)}`);
      labelValue('Tax', formatAmount(tax, currency));
      labelValue('Shipping', shipping === 0 ? 'FREE' : formatAmount(shipping, currency));
      y += 1;
      pdf.setDrawColor(196, 154, 69);
      pdf.line(left, y, right, y);
      y += 8;
      pdf.setFontSize(12);
      labelValue('GRAND TOTAL', formatAmount(amount, currency), true);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 90, 90);
      ensureSpace(12);
      pdf.text('Thank you for choosing TISHNAGII. For order assistance, contact care@tishnagii.com.', left, y + 5);
      const safeId = order.orderId.replace(/[^a-zA-Z0-9_-]/g, '-');
      pdf.save(`Tishnagii-Invoice-${safeId}.pdf`);
    } catch {
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        {onBack ? (
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-[#4A1525] hover:text-[#2A0814]">
            <ArrowLeft className="h-4 w-4" /> Back to orders
          </button>
        ) : <span />}
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 border border-[#EADBCE] px-4 py-2.5 text-sm text-[#2A0814] transition-colors hover:bg-[#F4EFEA]">
            <Printer className="h-4 w-4" /> Print Invoice
          </button>
          <button disabled={isDownloading} onClick={() => void downloadInvoice()} className="inline-flex items-center gap-2 bg-[#2A0814] px-4 py-2.5 text-sm text-[#FAF7F2] transition-colors hover:bg-[#380E1C] disabled:opacity-60">
            <Download className="h-4 w-4" /> {isDownloading ? 'Preparing...' : 'Download Invoice'}
          </button>
        </div>
      </div>

      <article className="invoice-print-area border border-[#EADBCE] bg-[#FAF7F2]">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EADBCE] bg-[#F4EFEA] p-5 sm:p-7">
          <div>
            <p className="font-serif text-2xl font-semibold tracking-[0.18em] text-[#2A0814]">TISHNAGII</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#C49A45]">Artisanal Jewellery · Jaipur, India</p>
          </div>
          <div className="text-right">
            <h2 className="font-serif text-xl text-[#2A0814]">Invoice</h2>
            <p className="mt-1 text-xs text-[#4A1525]/70">{invoiceDate}</p>
            <p className="text-xs font-medium text-[#2A0814]">{order.orderId}</p>
          </div>
        </header>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#C49A45]">Billed to</h3>
            <p className="mt-2 text-sm font-medium text-[#2A0814]">{customer?.fullName || 'Customer'}</p>
            {customer?.email && <p className="text-xs text-[#4A1525]/70">{customer.email}</p>}
            {customer?.phone && <p className="text-xs text-[#4A1525]/70">{customer.phone}</p>}
          </div>
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#C49A45]">Shipping address</h3>
            <p className="mt-2 break-words text-sm text-[#2A0814]">{customer?.address || 'Address unavailable'}</p>
          </div>
        </div>

        <div className="px-5 pb-4 sm:px-7">
          <div className="grid grid-cols-[minmax(0,1fr)_3rem_6rem_6rem] gap-2 border-y border-[#EADBCE] py-2 text-[10px] font-semibold uppercase tracking-wider text-[#4A1525] sm:grid-cols-[minmax(0,1fr)_4rem_7rem_7rem]">
            <span>Product</span><span className="text-right">Qty</span><span className="text-right">Price</span><span className="text-right">Total</span>
          </div>
          <div className="divide-y divide-[#EADBCE]">
            {order.items.map((item) => (
              <div key={item.productId} className="grid grid-cols-[minmax(0,1fr)_3rem_6rem_6rem] gap-2 py-3 text-xs text-[#2A0814] sm:grid-cols-[minmax(0,1fr)_4rem_7rem_7rem]">
                <span className="break-words">{item.name}</span>
                <span className="text-right">{item.quantity}</span>
                <span className="text-right">{formatAmount(item.price, currency)}</span>
                <span className="text-right">{formatAmount(item.price * item.quantity, currency)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 border-t border-[#EADBCE] bg-[#F4EFEA]/60 p-5 sm:grid-cols-2 sm:p-7">
          <div className="space-y-1 text-xs text-[#4A1525]/80">
            <p><span className="font-medium text-[#2A0814]">Order status:</span> {(order.status || 'processing').replaceAll('_', ' ')}</p>
            <p><span className="font-medium text-[#2A0814]">Payment status:</span> {order.paymentStatus || 'unknown'}</p>
            <p><span className="font-medium text-[#2A0814]">Payment method:</span> {paymentMethodLabel(order.paymentMethod, order.paymentMethodDetails)}</p>
            {order.paymentId && <p className="break-all"><span className="font-medium text-[#2A0814]">Razorpay Payment ID:</span> {order.paymentId}</p>}
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between gap-4"><span>Subtotal</span><span>{formatAmount(subtotal, currency)}</span></div>
            <div className="flex justify-between gap-4 text-emerald-800"><span>Discount</span><span>- {formatAmount(discount, currency)}</span></div>
            <div className="flex justify-between gap-4"><span>Tax</span><span>{formatAmount(tax, currency)}</span></div>
            <div className="flex justify-between gap-4"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatAmount(shipping, currency)}</span></div>
            <div className="flex justify-between gap-4 border-t border-[#EADBCE] pt-2 text-sm font-semibold text-[#2A0814]"><span>Grand Total</span><span>{formatAmount(amount, currency)}</span></div>
          </div>
        </div>
        <footer className="border-t border-[#EADBCE] px-5 py-4 text-center text-xs text-[#4A1525]/70 sm:px-7">
          Thank you for choosing TISHNAGII. For assistance, contact care@tishnagii.com.
        </footer>
      </article>
    </section>
  );
};