import {
  CanvasStreamSetup,
  MediaRecorderSetupParams,
} from "./video-recorder-types";

export const createCanvasStream = (
  video: HTMLVideoElement,
  audioTrack: MediaStreamTrack
): CanvasStreamSetup => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");

  const canvasStream = canvas.captureStream();
  canvasStream.addTrack(audioTrack);

  return { canvas, ctx, canvasStream };
};

export const setupMediaRecorder = ({
  stream,
  quality,
  chunksRef,
  setRecordedVideo,
  onRecordingComplete,
}: MediaRecorderSetupParams) => {
  const options = {
    mimeType: "video/webm;codecs=vp8,opus",
    videoBitsPerSecond: quality === "hd" ? 2500000 : 1000000,
  };

  const mediaRecorder = new MediaRecorder(stream, options);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    setRecordedVideo(url);
    onRecordingComplete(blob);
  };

  return mediaRecorder;
};

export const checkBrowserCompatibility = () => {
  const { isSecureContext } = window;
  const hasGetUserMedia = !!(
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  );
  const hasMediaRecorder = "MediaRecorder" in window;

  return isSecureContext && hasGetUserMedia && hasMediaRecorder;
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
