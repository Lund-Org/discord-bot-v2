import { useEffect } from 'react';

export function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent) => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (
        !ref.current ||
        (event.target && ref.current.contains(event.target as HTMLElement))
      ) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
}
