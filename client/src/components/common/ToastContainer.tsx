import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#2A0814] text-[#FAF7F2] border border-[#C49A45]/40 rounded-xs shadow-xl p-3.5 flex items-center gap-3 animate-fade-in"
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-[#C49A45] shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#D4AE58] shrink-0" />
          )}

          <p className="text-xs font-medium leading-snug flex-1">{toast.message}</p>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#FAF7F2]/50 hover:text-[#FAF7F2] p-1 cursor-pointer"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
