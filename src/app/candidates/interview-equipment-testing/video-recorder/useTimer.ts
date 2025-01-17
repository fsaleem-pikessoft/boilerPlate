import { useCallback, useRef } from 'react';

export const useTimer = (onTick: () => void) => {
  const timerRef = useRef<NodeJS.Timeout>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(onTick, 1000);
  }, [onTick]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  return { startTimer, stopTimer, resetTimer };
};
