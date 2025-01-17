import React, { memo } from "react";
import {
  FaStop,
  FaPause,
  FaPlay,
  FaMicrophoneSlash,
  FaMicrophone,
} from "react-icons/fa";
import { RecordingControlsProps } from "../video-recorder-types";
import { Button } from "@mui/material";
import { VideoCameraIcon } from "@heroicons/react/24/outline";

const RecordingControls: React.FC<RecordingControlsProps> = ({
  recordingState,
  elapsedTime,
  maxDuration,
  onStartRecording,
  onStopRecording,
  onTogglePause,
  onToggleMute,
}) => {
  return (
    <div className="flex gap-3 mb-5 flex-wrap">
      {!recordingState?.isRecording ? (
        <Button
          disabled={elapsedTime >= maxDuration}
          onClick={onStartRecording}
          type="submit"
          size="large"
          className="w-full h-12"
          sx={{ backgroundColor: "#0F416F", color: "white" }}
        >
          <VideoCameraIcon color="inherit" height={20} width={50} />
          Start Testing
        </Button>
      ) : (
        <>
          <div className="flex w-full gap-3">
            <Button
              onClick={onToggleMute}
              type="submit"
              size="medium"
              className="w-full h-12"
              sx={{ backgroundColor: "#0F416F", color: "white" }}
            >
              {recordingState?.isMuted ? (
                <FaMicrophoneSlash className="mr-2 h-5 w-5" />
              ) : (
                <FaMicrophone className="mr-2 h-5 w-5" />
              )}
              {recordingState?.isMuted ? "Unmute" : "Mute"}
            </Button>
            <Button
              disabled={elapsedTime >= maxDuration}
              onClick={onTogglePause}
              type="submit"
              size="medium"
              className="w-full h-12"
              sx={{ backgroundColor: "#0F416F", color: "white" }}
            >
              {recordingState?.isPaused ? (
                <FaPlay className="mr-2 h-5 w-5" />
              ) : (
                <FaPause className="mr-2 h-5 w-5" />
              )}{" "}
              {recordingState?.isPaused ? "Resume" : "Pause"}
            </Button>
          </div>

          <Button
            disabled={elapsedTime >= maxDuration}
            onClick={onStopRecording}
            type="submit"
            size="medium"
            className="w-full h-12"
            sx={{ backgroundColor: "red", color: "white" }}
          >
            <FaStop className="mr-2 h-5 w-5" />
            Stop
          </Button>
        </>
      )}
    </div>
  );
};

export default memo(RecordingControls);
