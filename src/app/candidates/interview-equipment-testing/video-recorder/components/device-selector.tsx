import React, { memo, useCallback } from "react";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { DeviceSelectorProps, DeviceType } from "../video-recorder-types";
import { IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import { MEDIA_TYPES } from "../constants";

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  isRecording,
  handleDeviceChange,
}) => {
  const getSelectedDeviceName = useCallback(
    (type: DeviceType) => {
      const deviceList =
        type === MEDIA_TYPES.VIDEO
          ? devices?.videoDevices
          : devices?.audioDevices;
      const selectedId =
        type === MEDIA_TYPES.VIDEO
          ? devices?.selectedVideo
          : devices?.selectedAudio;
      const device = deviceList?.find(
        (deviceInfo) => deviceInfo?.deviceId === selectedId
      );
      if (!device) {
        return type === MEDIA_TYPES.VIDEO
          ? "Select Camera"
          : "Select Microphone";
      }
      return (
        device?.label ||
        `${
          type === MEDIA_TYPES.VIDEO ? "Camera" : "Microphone"
        } ${selectedId?.slice(0, 5)}`
      );
    },
    [devices]
  );

  const handleDeviceSelect = useCallback(
    (type: DeviceType, deviceId: string) => {
      handleDeviceChange(type, deviceId);
    },
    [handleDeviceChange]
  );

  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <TextField
        select
        label="Camera"
        className="bg-[#F6F6F6] m-2 w-full text-center"
        value={devices?.selectedVideo || ""}
        onChange={(e) => handleDeviceSelect(MEDIA_TYPES.VIDEO, e.target.value)}
        disabled={isRecording}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <VideocamIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        defaultValue={getSelectedDeviceName(MEDIA_TYPES.VIDEO)} // Added usage of getSelectedDeviceName
      >
        {devices?.videoDevices?.map((device) => (
          <MenuItem key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Microphone"
        className="bg-[#F6F6F6] m-2 w-full text-center"
        value={devices?.selectedAudio || ""}
        onChange={(e) => handleDeviceSelect(MEDIA_TYPES.AUDIO, e.target.value)}
        disabled={isRecording}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <KeyboardVoiceIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        defaultValue={getSelectedDeviceName(MEDIA_TYPES.AUDIO)} // Added usage of getSelectedDeviceName
      >
        {devices?.audioDevices?.map((device) => (
          <MenuItem key={device.deviceId} value={device.deviceId}>
            {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default memo(DeviceSelector);
