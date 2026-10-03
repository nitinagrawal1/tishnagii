import { useEffect, useRef } from 'react';

type UseDialogFocusOptions = {
  initialFocus?: () => HTMLElement | null;
};

export const useDialogFocus = <T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
  options: UseDialogFocusOptions = {},
) => {
  const dialogRef = useRef<T>(null);
  const onCloseRef = useRef(onClose);
  const initialFocusRef = useRef(options.initialFocus);

  onCloseRef.current = onClose;
  initialFocusRef.current = options.initialFocus;

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const getFocusableElements = () => Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getAttribute('aria-hidden') !== 'true');

    const focusableElements = getFocusableElements();
    const initialFocus = initialFocusRef.current?.();
    (initialFocus || focusableElements[0] || dialog).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;

      const currentFocusableElements = getFocusableElements();
      if (currentFocusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = currentFocusableElements[0];
      const last = currentFocusableElements[currentFocusableElements.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [isOpen]);

  return dialogRef;
};
