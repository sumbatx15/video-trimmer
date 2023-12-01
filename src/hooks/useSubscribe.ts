import { useCallback, useRef } from "react";

export const useSubscribe = () => {
  const listeners = useRef<Set<() => void>>(new Set());

  const notify = useCallback(() => {
    listeners.current.forEach((listener) => listener());
  }, []);
  const subscribe = useCallback((listener: () => void) => {
    listeners.current.add(listener);
  }, []);
  const unsubscribe = useCallback((listener: () => void) => {
    listeners.current.delete(listener);
  }, []);

  return { notify, subscribe, unsubscribe };
};
