import { useEffect, RefObject, MouseEvent } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: () => void,
  ignoreRef?: RefObject<HTMLElement>
) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      ref.current &&
      !ref.current.contains(event.target as Node) &&
      !(ignoreRef?.current?.contains(event.target as Node))
    ) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside as unknown as EventListener);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside as unknown as EventListener);
    };
  }, [ref, callback, ignoreRef]);
};


export function useEscapeKey(onEscape: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscape]);
}