"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { checkBrowserCompatibility } from "./media-management";
import { useMediaDevices } from "./useMediaDevices";
import { useMediaStream } from "./useMediaStream";
import { VIDEO_RECORDER_CONSTANTS } from "./constants";
import VideoPreview from "./components/video-preview";

interface VideoPreviewerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoPreviewer: React.FC<VideoPreviewerProps> = ({ videoRef }) => {
  const { stopStream, setStream } = useMediaStream();
  const { getDevices, checkCameraAvailability } = useMediaDevices();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

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
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="w-full">
      <VideoPreview
        isLoading={isLoading}
        isPreviewReady={isPreviewReady}
        showPermissionModal={showPermissionModal}
        videoRef={videoRef}
        hasCamera={checkCameraAvailability}
      />
    </div>
  );
};

export default memo(VideoPreviewer);
