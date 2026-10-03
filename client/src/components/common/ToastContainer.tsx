import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  return (
    <div aria-live="polite" aria-atomic="false" className="fixed bottom-[calc(1rem_+_env(safe-area-inset-bottom))] right-[calc(1rem_+_env(safe-area-inset-right))] z-50 flex max-w-sm flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex min-w-0 items-center gap-3 rounded-xs border border-[#C49A45]/40 bg-[#2A0814] p-3.5 text-[#FAF7F2] shadow-xl animate-fade-in"
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-[#C49A45] shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#D4AE58] shrink-0" />
          )}

          <p className="min-w-0 flex-1 break-words text-xs font-medium leading-snug">{toast.message}</p>

          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.onAction();
                removeToast(toast.id);
              }}
              className="min-h-11 min-w-11 shrink-0 text-xs font-semibold text-[#D4AE58] underline underline-offset-2 hover:text-white"
            >
              {toast.action.label}
            </button>
          )}
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center text-[#FAF7F2]/50 hover:text-[#FAF7F2]"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
