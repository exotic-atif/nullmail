import { useEffect, useRef } from 'react';

export function useAutosave(
  callback: () => void,
  isDirty: boolean,
  intervalMs = 5000
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!isDirty) return;

    const timer = setInterval(() => {
      callbackRef.current();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isDirty, intervalMs]);
}
