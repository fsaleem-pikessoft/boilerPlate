import React, { FC, useState } from "react";
import VideoRecorder from "./video-recorder";
import { VideoRecorderModalProps } from "./video-recorder/video-recorder-types";
import { Button } from "@mui/material";
import { VideoCameraIcon } from "@heroicons/react/24/outline";

const VideoRecorderModal: FC<VideoRecorderModalProps> = ({
  maxDuration = 60,
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>();

  const handleRecordingComplete = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);
  };

  const handleRecordAgain = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
  };

  return (
    <div className="w-full h-full">
      {!videoUrl ? (
        <VideoRecorder
          maxDuration={maxDuration}
          quality="hd"
          onRecordingComplete={handleRecordingComplete}
        />
      ) : (
        <div className="space-y-4 m-5 bg-black">
          <div className="aspect-videorounded-lg overflow-hidden">
            <video
              src={videoUrl}
              controls
              className="w-full h-full  rounded-none object-contain"
            >
              <track kind="captions" />
              Your browser does not support the video element.
            </video>
          </div>
          <div className="flex justify-end py-5  bg-white  gap-3">
            <Button
              onClick={handleRecordAgain}
              type="submit"
              size="medium"
              fullWidth
              sx={{ backgroundColor: "#0F416F", color: "white" }}
            >
              <VideoCameraIcon color="inherit" height={20} width={50} />
              Record Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRecorderModal;
