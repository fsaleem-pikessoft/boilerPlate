import { useState, useCallback } from "react";
import { DeviceInfo } from "./video-recorder-types";

export const useMediaDevices = () => {
  const [devices, setDevices] = useState<DeviceInfo>({
    videoDevices: [],
    audioDevices: [],
    selectedVideo: "",
    selectedAudio: "",
  });

  const getDevices = useCallback(async () => {
    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices.filter(
        (device) => device.kind === "videoinput"
      );
      const audioDevices = mediaDevices.filter(
        (device) => device.kind === "audioinput"
      );

      setDevices((prev) => ({
        ...prev,
        videoDevices,
        audioDevices,
        selectedVideo: videoDevices[0]?.deviceId || "",
        selectedAudio: audioDevices[0]?.deviceId || "",
      }));
    } catch (error) {
      console.error("Error getting devices:", error);
    }
  }, []);

  const checkCameraAvailability = useCallback(async () => {
    try {
      const checkCameraDevice = await navigator.mediaDevices.enumerateDevices();
      return checkCameraDevice?.some((device) => device?.kind === "videoinput");
    } catch {
      return false;
    }
  }, []);

  return { devices, setDevices, getDevices, checkCameraAvailability };
};
