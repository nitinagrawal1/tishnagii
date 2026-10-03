import { useCallback, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';

export const useUnsavedChanges = (isDirty: boolean, guardId: string) => {
  const { registerNavigationGuard } = useShop();
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  const shouldBlockNavigation = useCallback(() => isDirtyRef.current, []);

  useEffect(
    () => registerNavigationGuard(guardId, shouldBlockNavigation),
    [guardId, registerNavigationGuard, shouldBlockNavigation],
  );

  useEffect(() => {
    if (!isDirty) return;

    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [isDirty]);

  const confirmDiscard = useCallback(() => {
    if (!isDirtyRef.current) return true;
    const confirmed = window.confirm('You have unsaved changes that will be lost. Discard them?');
    if (confirmed) isDirtyRef.current = false;
    return confirmed;
  }, []);

  const markClean = useCallback(() => {
    isDirtyRef.current = false;
  }, []);

  return { confirmDiscard, markClean };
};
