import React, { memo } from "react";
import { FaVideo } from "react-icons/fa";

import { RecordedVideoPreviewProps } from "../video-recorder-types";

const RecordedVideoPreview: React.FC<RecordedVideoPreviewProps> = ({
  recordedVideo,
  onRecordAgain,
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Recorded Video</h3>
      <div className="space-y-4">
        <video
          src={recordedVideo}
          controls
          playsInline
          autoPlay={false}
          className="w-full aspect-video rounded-lg bg-black"
        >
          <track kind="captions" label="English captions" src="" srcLang="en" />
        </video>
        {onRecordAgain && (
          <div className="flex flex-wrap gap-3">
            <button className="text-black" onClick={onRecordAgain}>
              <FaVideo className="mr-2 h-5 w-5" />
              Record Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(RecordedVideoPreview);
