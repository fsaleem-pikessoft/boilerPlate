"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  checkBrowserCompatibility,
  createCanvasStream,
  formatTime,
  setupMediaRecorder,
} from "./media-management";
import { useMediaDevices } from "./useMediaDevices";
import { useRecordingState } from "./useRecordingState";
import { useMediaStream } from "./useMediaStream";
import { useTimer } from "./useTimer";
import { MEDIA_TYPES, VIDEO_RECORDER_CONSTANTS } from "./constants";
import DeviceSelector from "./components/device-selector";
import VideoPreview from "./components/video-preview";
import RecordingControls from "./components/recording-controls";
import { DeviceType, VideoRecorderProps } from "./video-recorder-types";

const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onRecordingComplete,
  maxDuration = 60,
  quality = "hd",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { streamRef, stopStream, setStream } = useMediaStream();
  const { devices, setDevices, getDevices, checkCameraAvailability } =
    useMediaDevices();
  const {
    recordingState,
    setRecordingState,
    elapsedTime,
    setElapsedTime,
    recordedVideo,
    setRecordedVideo,
  } = useRecordingState();

  const { startTimer, stopTimer, resetTimer } = useTimer(() =>
    setElapsedTime((prev) => prev + 1)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isVideoDropdownOpen, setIsVideoDropdownOpen] = useState(false);
  const [isAudioDropdownOpen, setIsAudioDropdownOpen] = useState(false);
  const videoDropdownRef = useRef<HTMLDivElement>(null);
  const audioDropdownRef = useRef<HTMLDivElement>(null);

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
    recordingState?.isRecording,
    resetTimer,
    setRecordingState,
    stopStream,
  ]);

  const startPreview = useCallback(async () => {
    if (!isLoading) setIsLoading(true);

    try {
      if (!checkBrowserCompatibility()) {
        setIsPreviewReady(false);
        setShowPermissionModal(true);
        return;
      }

      const stream = await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .catch((error) => {
          if (
            error.name === VIDEO_RECORDER_CONSTANTS.ERRORS.NOT_ALLOWED ||
            error.name === VIDEO_RECORDER_CONSTANTS.ERRORS.PERMISSION_DENIED ||
            error.name === VIDEO_RECORDER_CONSTANTS.ERRORS.NOT_FOUND
          ) {
            setShowPermissionModal(true);
            setIsPreviewReady(false);
          }
          throw error;
        });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStream(stream);
        setIsPreviewReady(true);
        setShowPermissionModal(false);
      }

      await getDevices();
    } catch (error: any) {
      if (
        !error.name.includes("NotAllowed") &&
        !error.name.includes("PermissionDenied") &&
        !error.name.includes("NotFound")
      ) {
        setIsPreviewReady(false);
      }
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [isLoading, setStream, getDevices]);

  useEffect(() => {
    (async () => {
      try {
        await startPreview();
      } catch (error) {
        console.error(
          VIDEO_RECORDER_CONSTANTS.CONSOLE_MESSAGES.CAMERA_INIT_ERROR,
          error
        );
      }
    })();

    return () => {
      stopStream();
      if (mediaRecorderRef.current && recordingState.isRecording) {
        mediaRecorderRef.current.stop();
      }
      stopTimer();
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (recordingState?.isRecording && elapsedTime >= maxDuration) {
      stopRecording();
    }
  }, [elapsedTime, maxDuration, recordingState?.isRecording, stopRecording]);

  const startRecording = useCallback(async () => {
    try {
      chunksRef.current = [];

      if (!streamRef.current) {
        await startPreview();
      }

      const video = videoRef.current;
      const audioTrack = streamRef.current?.getAudioTracks()?.[0];

      if (!video || !audioTrack) {
        throw new Error(
          VIDEO_RECORDER_CONSTANTS.ERRORS.VIDEO_AUDIO_NOT_AVAILABLE
        );
      }

      const { canvas, ctx, canvasStream } = createCanvasStream(
        video,
        audioTrack
      );

      const drawFrame = () => {
        ctx?.save();
        ctx?.scale(-1, 1);
        ctx?.translate(-canvas.width, 0);
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx?.restore();

        if (!recordingState.isPaused) {
          requestAnimationFrame(drawFrame);
        }
      };

      requestAnimationFrame(drawFrame);

      mediaRecorderRef.current = setupMediaRecorder({
        stream: canvasStream,
        quality,
        chunksRef,
        setRecordedVideo,
        onRecordingComplete,
      });

      mediaRecorderRef.current?.start(1000);
      setRecordingState((prev) => ({ ...prev, isRecording: true }));
      startTimer();
    } catch {
      throw new Error(
        VIDEO_RECORDER_CONSTANTS.CONSOLE_MESSAGES.RECORDING_ERROR
      );
    }
  }, [
    streamRef,
    quality,
    setRecordedVideo,
    onRecordingComplete,
    setRecordingState,
    startTimer,
    startPreview,
    recordingState.isPaused,
  ]);

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

  const handleDeviceChange = useCallback(
    async (type: DeviceType, deviceId: string) => {
      if (
        (type === MEDIA_TYPES.VIDEO && deviceId === devices.selectedVideo) ||
        (type === MEDIA_TYPES.AUDIO && deviceId === devices.selectedAudio)
      ) {
        if (type === MEDIA_TYPES.VIDEO) setIsVideoDropdownOpen(false);

        return;
      }

      try {
        setIsLoading(true);
        streamRef.current?.getTracks().forEach((track) => track.stop());

        setDevices((prev) => ({
          ...prev,
          [type === MEDIA_TYPES.VIDEO ? "selectedVideo" : "selectedAudio"]:
            deviceId,
        }));

        const constraints = {
          video: {
            deviceId:
              type === MEDIA_TYPES.VIDEO ? deviceId : devices.selectedVideo,
            width:
              quality === "hd"
                ? VIDEO_RECORDER_CONSTANTS.HD_RESOLUTION.width
                : VIDEO_RECORDER_CONSTANTS.SD_RESOLUTION.width,
            height:
              quality === "hd"
                ? VIDEO_RECORDER_CONSTANTS.HD_RESOLUTION.height
                : VIDEO_RECORDER_CONSTANTS.SD_RESOLUTION.height,
          },
          audio: {
            deviceId:
              type === MEDIA_TYPES.AUDIO ? deviceId : devices.selectedAudio,
            echoCancellation:
              VIDEO_RECORDER_CONSTANTS.MEDIA_CONSTRAINTS.ECHO_CANCELLATION,
            noiseSuppression:
              VIDEO_RECORDER_CONSTANTS.MEDIA_CONSTRAINTS.NOISE_SUPPRESSION,
          },
        };

        const newStream = await navigator.mediaDevices
          .getUserMedia(constraints)
          .catch(async () => {
            return navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });
          });

        if (!videoRef.current) {
          throw new Error(
            VIDEO_RECORDER_CONSTANTS.ERRORS.VIDEO_REF_NOT_AVAILABLE
          );
        }

        videoRef.current.srcObject = newStream;
        streamRef.current = newStream;
        setIsPreviewReady(true);
      } catch (error) {
        console.error(
          VIDEO_RECORDER_CONSTANTS.CONSOLE_MESSAGES.DEVICE_SWITCH_ERROR,
          error
        );
        setIsPreviewReady(false);
      } finally {
        setTimeout(
          () => setIsLoading(false),
          VIDEO_RECORDER_CONSTANTS.LOADING_DELAY
        );
      }
    },
    [
      devices.selectedVideo,
      devices.selectedAudio,
      streamRef,
      setDevices,
      quality,
    ]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        videoDropdownRef.current &&
        !videoDropdownRef.current.contains(event.target as Node)
      ) {
        setIsVideoDropdownOpen(false);
      }
      if (
        audioDropdownRef.current &&
        !audioDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAudioDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleDeviceConnectionChange = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices?.filter(
          (device) =>
            device?.kind === VIDEO_RECORDER_CONSTANTS.DEVICE_TYPES.VIDEO
        );
        const audioDevices = mediaDevices.filter(
          (device) =>
            device?.kind === VIDEO_RECORDER_CONSTANTS.DEVICE_TYPES.AUDIO
        );

        const isVideoDeviceAvailable = videoDevices?.some(
          (device) => device?.deviceId === devices?.selectedVideo
        );
        const isAudioDeviceAvailable = audioDevices?.some(
          (device) => device?.deviceId === devices?.selectedAudio
        );

        if (recordingState?.isRecording && !isVideoDeviceAvailable) {
          stopRecording();
        } else if (!isVideoDeviceAvailable || !isAudioDeviceAvailable) {
          const newVideoId = videoDevices[0]?.deviceId || "";
          const newAudioId = audioDevices[0]?.deviceId || "";

          setDevices((prev) => ({
            ...prev,
            videoDevices,
            audioDevices,
            selectedVideo: isVideoDeviceAvailable
              ? prev.selectedVideo
              : newVideoId,
            selectedAudio: isAudioDeviceAvailable
              ? prev.selectedAudio
              : newAudioId,
          }));

          if (!recordingState?.isRecording) {
            if (!isVideoDeviceAvailable) {
              await handleDeviceChange(MEDIA_TYPES.VIDEO, newVideoId);
            }
            if (!isAudioDeviceAvailable) {
              await handleDeviceChange(MEDIA_TYPES.VIDEO, newAudioId);
            }
          }
        }
      } catch {
        throw new Error(
          VIDEO_RECORDER_CONSTANTS.CONSOLE_MESSAGES.DEVICE_CHANGE_ERROR
        );
      }
    };

    navigator.mediaDevices.addEventListener(
      "devicechange",
      handleDeviceConnectionChange
    );

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceConnectionChange
      );
    };
  }, [
    devices?.selectedVideo,
    devices?.selectedAudio,
    recordingState?.isRecording,
    stopRecording,
    handleDeviceChange,
    setDevices,
  ]);

  return (
    <div className="w-full max-w-4xl mx-auto p-5">
      {!recordedVideo && (
        <>
          {/* <FaSync
            onClick={handleReloadDevices}
            className={`mr-2 h-5 w-5 ${isReloading ? "animate-spin" : ""}`}
          /> */}
          <VideoPreview
            isLoading={isLoading}
            isPreviewReady={isPreviewReady}
            showPermissionModal={showPermissionModal}
            videoRef={videoRef}
            recordingState={recordingState}
            elapsedTime={elapsedTime}
            maxDuration={maxDuration}
            formatTime={formatTime}
            hasCamera={checkCameraAvailability}
          />

          {isPreviewReady && (
            <RecordingControls
              recordingState={recordingState}
              elapsedTime={elapsedTime}
              maxDuration={maxDuration}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onTogglePause={togglePause}
              onToggleMute={toggleMute}
            />
          )}

          <DeviceSelector
            devices={devices}
            isRecording={recordingState?.isRecording}
            isVideoDropdownOpen={isVideoDropdownOpen}
            isAudioDropdownOpen={isAudioDropdownOpen}
            videoDropdownRef={videoDropdownRef}
            audioDropdownRef={audioDropdownRef}
            setIsVideoDropdownOpen={setIsVideoDropdownOpen}
            setIsAudioDropdownOpen={setIsAudioDropdownOpen}
            handleDeviceChange={handleDeviceChange}
          />
        </>
      )}
    </div>
  );
};

export default memo(VideoRecorder);
