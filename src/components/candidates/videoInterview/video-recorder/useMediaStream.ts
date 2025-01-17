import { useCallback, useRef } from 'react';

export const useMediaStream = () => {
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, []);

  const setStream = useCallback((stream: MediaStream) => {
    streamRef.current = stream;
  }, []);

  return { streamRef, stopStream, setStream };
};
