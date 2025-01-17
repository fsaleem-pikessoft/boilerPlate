import React from "react";

export type VideoRecorderProps = {
  onRecordingComplete: (videoBlob: Blob) => void;
  maxDuration?: number;
  quality?: "hd" | "sd";
  stopTimer: () => void;
  startTimer: () => void;
  resetTimer: () => void;
};

export type DeviceInfo = {
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
  selectedVideo: string;
  selectedAudio: string;
};

export type RecordingState = {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  isMuted: boolean;
  showPreview?: boolean;
};

export type VideoPreviewProps = {
  isLoading: boolean;
  isPreviewReady: boolean;
  showPermissionModal: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  hasCamera: () => Promise<boolean>;
};

export type DeviceType = "video" | "audio";

export interface VideoRecorderModalProps {
  isOpen: boolean;
  videoUrl: string | null;
  onClose: () => void;
  onRecordingComplete: (blob: Blob) => void;
  handleRecordAgain: () => void;
  maxDuration?: number;
}

export type DeviceSelectorProps = {
  devices: DeviceInfo;
  isRecording: boolean;
  isVideoDropdownOpen: boolean;
  isAudioDropdownOpen: boolean;
  videoDropdownRef: React.RefObject<HTMLDivElement>;
  audioDropdownRef: React.RefObject<HTMLDivElement>;
  setIsVideoDropdownOpen: (value: boolean) => void;
  setIsAudioDropdownOpen: (value: boolean) => void;
  handleDeviceChange: (type: DeviceType, deviceId: string) => void;
};

export type RecordingControlsProps = {
  recordingState: RecordingState;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
};

export type RecordedVideoPreviewProps = {
  recordedVideo: string;
  onRecordAgain?: () => void;
};

export type VideoQuality = "hd" | "sd";

export type CanvasStreamSetup = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  canvasStream: MediaStream;
};

export type MediaRecorderSetupParams = {
  stream: MediaStream;
  quality: VideoQuality;
  chunksRef: React.MutableRefObject<Blob[]>;
  setRecordedVideo: (url: string) => void;
  onRecordingComplete: (blob: Blob) => void;
};
