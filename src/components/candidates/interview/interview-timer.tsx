import { useEffect, useState, useRef } from "react";
import { useTimer } from "../videoInterview/video-recorder/useTimer";
import { Avatar } from "@mui/material";
import { toast } from "react-toastify";

const InterviewTimer = ({
  interviewData,
  isRecording = false,
  stopRecording = () => {},
  handleSubmit = () => {},
  questionType,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const { duration } = interviewData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const hasSubmittedRef = useRef(false);

  const { startTimer, stopTimer, resetTimer } = useTimer(() => {
    setElapsedTime((prev) => prev + 1);
    setRemainingTime((prev) => {
      const newTime = prev - 1;

      if (newTime === 20 && !hasShownWarning) {
        toast.warning(
          "Time is about to finish! Please complete your response.",
          {
            toastId: "time-warning",
          }
        );
        setHasShownWarning(true);
      }

      if (newTime === 0 && !hasSubmittedRef.current) {
        hasSubmittedRef.current = true;
        autoSubmit();
      }

      return newTime;
    });
  });

  const autoSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    stopTimer();

    if (questionType === "video") {
      if (isRecording) {
        stopRecording();
        handleSubmit();
      } else {
        handleSubmit();
      }
    } else if (questionType === "text") {
      handleSubmit();
    }
  };

  // Reset warning flag when interview response changes
  useEffect(() => {
    setHasShownWarning(false);
  }, [interviewData.interviewResponse]);

  useEffect(() => {
    resetTimer();
    if (interviewData.interviewResponse?.[0]?.startTime) {
      const startTime = new Date(
        interviewData.interviewResponse?.[0]?.startTime
      );
      const currentTime = new Date();
      const timeElapsed = Math.floor(
        (currentTime.getTime() - startTime.getTime()) / 1000
      );
      const totalDuration = duration * 60;

      if (timeElapsed < totalDuration) {
        setElapsedTime(timeElapsed);
        setRemainingTime(totalDuration - timeElapsed);
        startTimer();
      } else if (!hasSubmittedRef.current) {
        hasSubmittedRef.current = true;
        autoSubmit();
        setRemainingTime(0);
      }
    }

    return () => {
      stopTimer();
      resetTimer();
    };
  }, [interviewData.interviewResponse?.startTime, duration]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="relative w-[150px] h-[150px]">
      <div
        className="absolute w-[150px] h-[150px] overflow-hidden"
        style={{
          borderRadius: "50%",
          padding: "3px",
          backgroundClip: "padding-box",
          backgroundImage: `conic-gradient(
            from 0deg,
            #0F416F ${(elapsedTime / (duration * 60)) * 100}%,
            transparent ${(elapsedTime / (duration * 60)) * 100}% 100%
          ), repeating-conic-gradient(
            from 0deg,
            lightgray 0deg 5deg,
            transparent 5deg 8deg
          )`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
        }}
      />

      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          margin: "3px",
        }}
        className="absolute inset-0 flex items-center justify-center rounded-full"
      >
        <div className="text-lg text-white items-center justify-center flex flex-col">
          {remainingTime > 0 ? (
            <span>{formatTime(remainingTime)}</span>
          ) : (
            <span className="text-center text-md">Time's up!</span>
          )}
          <Avatar
            src="/images/bell.svg"
            sx={{
              width: 30,
              height: 35,
              "& img": {
                objectFit: "contain",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewTimer;
