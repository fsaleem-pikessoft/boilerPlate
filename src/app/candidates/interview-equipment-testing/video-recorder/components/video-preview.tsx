import React, { memo, useCallback } from "react";
import { FaCamera } from "react-icons/fa";
import { VideoPreviewProps } from "../video-recorder-types";

const VideoPreview: React.FC<VideoPreviewProps> = ({
  isLoading,
  isPreviewReady,
  showPermissionModal,
  videoRef,
  recordingState,
  elapsedTime,
  maxDuration,
  formatTime,
  hasCamera,
}) => {
  const [cameraAvailable, setCameraAvailable] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const available = await hasCamera();
      setCameraAvailable(available);
    })();
  }, [hasCamera]);

  const handleReloadPage = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="w-full aspect-video bg-black grid place-items-center rounded-lg mb-5">
      {isLoading && (
        <div className="flex items-center justify-center absolute  bg-black z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white">Loading camera...</span>
          </div>
        </div>
      )}

      {!isPreviewReady && showPermissionModal && (
        <div className="flex items-center justify-center bg-black">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <FaCamera className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    Enable camera and microphone access
                  </h3>
                  <p className="text-gray-500">
                    Follow these steps to enable access:
                  </p>
                </div>
              </div>

              <ol className="list-decimal ml-5 space-y-3">
                <li>
                  Click the camera icon{" "}
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded">
                    🔒
                  </span>{" "}
                  in your browser&apos;s address bar
                </li>
                <li>
                  Select &quot;Always allow&quot; for both camera and microphone
                </li>
                <li>Click &quot;Done&quot;</li>
                <li>Refresh the page</li>
              </ol>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  After enabling permissions, refresh this page to start using
                  the camera and microphone.
                </p>
              </div>

              <div className="flex gap-3">
                <button color="gray" onClick={handleReloadPage}>
                  Refresh page
                </button>
              </div>
            </div>
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

      {recordingState?.isRecording && (
        <div className=" flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white">
            {formatTime(elapsedTime)} / {formatTime(maxDuration)}
          </span>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-full h-full object-cover scale-x-[-1] ${
          !isPreviewReady ? "hidden" : ""
        }`}
      >
        <track kind="captions" label="English captions" src="" srcLang="en" />
      </video>
    </div>
  );
};

export default memo(VideoPreview);
