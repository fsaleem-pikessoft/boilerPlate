import React, { memo } from "react";
import { FaCamera } from "react-icons/fa";
import { VideoPreviewProps } from "../video-recorder-types";

const VideoPreview: React.FC<VideoPreviewProps> = ({
  isLoading,
  isPreviewReady,
  showPermissionModal,
  videoRef,
  hasCamera,
}) => {
  const [cameraAvailable, setCameraAvailable] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const available = await hasCamera();
      setCameraAvailable(available);
    })();
  }, [hasCamera]);

  return (
    <div className="w-full h-[50vh] grid place-items-center rounded-lg mb-5">
      {isLoading && (
        <div className="flex items-center justify-center absolute z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white">Loading camera...</span>
          </div>
        </div>
      )}

      {!cameraAvailable && !isLoading && !showPermissionModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="flex flex-col items-center gap-2">
            <FaCamera className="w-12 h-12 text-gray-400" />
            <span className="text-gray-400">Camera not available</span>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-full h-[50vh]  rounded-[20px] object-contain scale-x-[-1] ${
          !isPreviewReady ? "hidden" : ""
        }`}
      >
        <track kind="captions" label="English captions" src="" srcLang="en" />
      </video>
    </div>
  );
};

export default memo(VideoPreview);
