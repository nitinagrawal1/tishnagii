import type { MouseEvent } from 'react';

export const handleInternalLinkClick = (
  event: MouseEvent<HTMLAnchorElement>,
  navigate: () => void,
) => {
  const link = event.currentTarget;
  if (
    event.defaultPrevented
    || event.button !== 0
    || event.metaKey
    || event.ctrlKey
    || event.shiftKey
    || event.altKey
    || (link.target && link.target !== '_self')
    || link.hasAttribute('download')
  ) {
    return;
  }

  event.preventDefault();
  navigate();
};
