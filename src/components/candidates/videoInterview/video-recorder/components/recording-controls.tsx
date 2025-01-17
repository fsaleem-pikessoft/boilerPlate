import React, { memo } from "react";
import { FaStop, FaPause, FaPlay } from "react-icons/fa";
import { RecordingControlsProps } from "../video-recorder-types";
import VideocamIcon from "@mui/icons-material/Videocam";

const RecordingControls: React.FC<RecordingControlsProps> = ({
  recordingState,
  onStartRecording,
  onStopRecording,
  onTogglePause,
  onToggleMute,
}) => {
  return (
    <div className="flex gap-4 flex-row">
      <button
        className="bg-secondary cursor-pointer h-[50px] w-[50px] border-0  items-center justify-center rounded-full"
        onClick={onStartRecording}
        type="button"
      >
        <VideocamIcon className="text-white" />
      </button>
      {recordingState?.isRecording && (
        <>
          <button
            className="bg-secondary cursor-pointer h-[50px] w-[50px] border-0  items-center justify-center rounded-full"
            onClick={onTogglePause}
            type="button"
          >
            <div className="flex items-center justify-center">
              {recordingState?.isPaused ? (
                <FaPlay className="text-white" />
              ) : (
                <FaPause className="text-white" />
              )}
            </div>
          </button>
          <button
            className="bg-red-500 cursor-pointer h-[50px] w-[50px] border-0  items-center justify-center rounded-full"
            onClick={onStopRecording}
            type="button"
          >
            <div className="flex items-center justify-center">
              <FaStop className="text-white" />
            </div>
          </button>
        </>
      )}
    </div>
  );
};

export default memo(RecordingControls);

// might be we need in future
// {
//   /* <button
//   className="bg-secondary cursor-pointer h-[50px] w-[50px] border-0  items-center justify-center rounded-full"
//   onClick={onToggleMute}
//   type="button"
// >
//   <div className="flex items-center justify-center">
//     {recordingState?.isMuted ? (
//       <FaMicrophoneSlash className="text-white" />
//     ) : (
//       <FaMicrophone className="text-white" />
//     )}
//   </div>
// </button> */
// }
