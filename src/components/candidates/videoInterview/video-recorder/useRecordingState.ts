import { useState, useCallback } from "react";
import { RecordingState } from "./video-recorder-types";

export const useRecordingState = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    isMuted: false,
  });

  const [elapsedTime, setElapsedTime] = useState(0);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);

  const resetRecording = useCallback(() => {
    setElapsedTime(0);
    setRecordingState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      isMuted: false,
    });
  }, []);

  return {
    recordingState,
    setRecordingState,
    elapsedTime,
    setElapsedTime,
    recordedVideo,
    setRecordedVideo,
    resetRecording,
  };
};
