export const MEDIA_TYPES = {
  VIDEO: 'video' as const,
  AUDIO: 'audio' as const,
} as const;

export const VIDEO_RECORDER_CONSTANTS = {
  HD_RESOLUTION: {
    width: 1920,
    height: 1080,
  },
  SD_RESOLUTION: {
    width: 1280,
    height: 720,
  },
  TIMER_DELAY: 1000,
  LOADING_DELAY: 500,
  RELOAD_DELAY: 1000,
  ERRORS: {
    NOT_ALLOWED: 'NotAllowedError',
    PERMISSION_DENIED: 'PermissionDeniedError',
    NOT_FOUND: 'NotFoundError',
    VIDEO_AUDIO_NOT_AVAILABLE: 'Video or audio track not available',
    VIDEO_REF_NOT_AVAILABLE: 'Video reference is not available',
  },
  DEVICE_TYPES: {
    VIDEO: 'videoinput',
    AUDIO: 'audioinput',
  },
  MEDIA_CONSTRAINTS: {
    ECHO_CANCELLATION: true,
    NOISE_SUPPRESSION: true,
  },
  CONSOLE_MESSAGES: {
    PREVIEW_ERROR: 'Error starting preview:',
    CAMERA_INIT_ERROR: 'Error initializing camera:',
    RECORDING_ERROR: 'Error starting recording:',
    DEVICE_SWITCH_ERROR: 'Error switching device:',
    REINIT_CAMERA_ERROR: 'Error reinitializing camera:',
    DEVICE_CHANGE_ERROR: 'Error handling device change:',
  },
  INPUT_TYPES: {
    MEDIA_TYPES,
  },
};
