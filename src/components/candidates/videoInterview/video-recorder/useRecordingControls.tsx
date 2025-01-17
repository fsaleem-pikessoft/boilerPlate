import { useCallback, useRef } from "react";
import { VIDEO_RECORDER_CONSTANTS } from "./constants";
import { createCanvasStream, setupMediaRecorder } from "./media-management";

export const useRecordingControls = ({
  videoRef,
  streamRef,
  mediaRecorderRef,
  chunksRef,
  recordingState,
  setRecordingState,
  setRecordedVideo,
  onRecordingComplete,
  startTimer,
  stopTimer,
  stopStream,
  resetTimer,
  startPreview,
  quality,
  elapsedTime,
}) => {
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      stopStream();
      resetTimer();
      setRecordingState((prev) => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        showPreview: true,
        duration: elapsedTime,
      }));

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [
    elapsedTime,
    recordingState.isRecording,
    resetTimer,
    setRecordingState,
    stopStream,
  ]);

  const startRecording = async () => {
    try {
      if (!streamRef.current) {
        throw new Error("Media stream is not available");
      }

      const videoTrack = streamRef.current.getVideoTracks()[0];
      const audioTrack = streamRef.current.getAudioTracks()[0];

      if (!videoTrack || !audioTrack) {
        throw new Error("Video or audio track not available");
      }

      // Initialize the MediaRecorder
      mediaRecorderRef.current = setupMediaRecorder({
        stream: streamRef.current,
        quality,
        chunksRef,
        setRecordedVideo,
        onRecordingComplete,
      });

      // Start recording
      mediaRecorderRef.current.start();
      startTimer();
      setRecordingState((prev) => ({
        ...prev,
        isRecording: true,
        isPaused: false,
      }));
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  };

  const togglePause = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (recordingState.isPaused) {
        mediaRecorderRef.current.resume();
        startTimer();
      } else {
        mediaRecorderRef.current.pause();
        stopTimer();
      }
      setRecordingState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
    }
  }, [recordingState.isPaused, setRecordingState, startTimer, stopTimer]);

  const toggleMute = useCallback(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        const newTrack = track.clone();
        newTrack.enabled = !track.enabled;
        streamRef.current?.removeTrack(track);
        streamRef.current?.addTrack(newTrack);
      });
      setRecordingState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
    }
  }, [setRecordingState, streamRef]);

  return {
    startRecording,
    stopRecording,
    togglePause,
    toggleMute,
  };
};
