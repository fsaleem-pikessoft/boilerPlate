import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Avatar, Box, Card } from "@mui/material";
import Grid from "@mui/material/Grid2";
import VideocamIcon from "@mui/icons-material/Videocam";
import { VideoCall } from "@mui/icons-material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { HEADER } from "../../../utils/common";
import {
  candidateInterviewDetails,
  interVierDetails,
} from "../../../api/jobsApi";
import VideoRecorder from "../videoInterview/video-recorder";
import { useRecordingState } from "../videoInterview/video-recorder/useRecordingState";
import { useTimer } from "../videoInterview/video-recorder/useTimer";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import InterviewTimer from "./interview-timer";
import RecordingControls from "../videoInterview/video-recorder/components/recording-controls";
import { useRecordingControls } from "../videoInterview/video-recorder/useRecordingControls";
import { useMediaStream } from "../videoInterview/video-recorder/useMediaStream";
import { formatTime } from "../videoInterview/video-recorder/media-management";

interface Question {
  id: number;
  title: string;
  description: string;
  duration: number;
  type: "video" | "text";
  interviewResponse: any[]; // Replace 'any' with specific response type if available
}
interface Job {
  id: number;
  title: string;
  endDate: string;
  questions: Question[];
}
interface InterviewData {
  id: number;
  job: Job;
}
interface FormDataResponse {
  questionId: number;
  answer: string;
}

const Interview = () => {
  const { id } = useParams();
  const router = useRouter();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [interviewData, setInterviewData] = useState<InterviewData | null>(
    null
  );
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [nextQuestion, setNextQuestion] = useState<boolean>(false);
  const QuestionType = interviewData?.job?.questions[activeQuestionIndex]?.type;
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { streamRef, stopStream } = useMediaStream();
  const answerRef = useRef<string>("");
  const uploadFileRef = useRef<File | null>(null);

  const {
    recordingState,
    setRecordingState,
    elapsedTime,
    setElapsedTime,
    setRecordedVideo,
  } = useRecordingState();

  const { startTimer, stopTimer, resetTimer } = useTimer(() =>
    setElapsedTime((prev) => prev + 1)
  );

  const handleRecordingComplete = (blob: Blob): void => {
    const file = new File([blob], "recorded-video.mp4", {
      type: "video/mp4",
    });
    console.log("file", file);
    setUploadFile(file);
    const previewUrl = URL.createObjectURL(file);
    setVideoUrl(previewUrl);
  };

  const { startRecording, stopRecording, togglePause, toggleMute } =
    useRecordingControls({
      videoRef,
      streamRef,
      mediaRecorderRef,
      chunksRef,
      recordingState,
      setRecordingState,
      setRecordedVideo,
      onRecordingComplete: handleRecordingComplete,
      startTimer,
      stopTimer,
      stopStream,
      resetTimer,
      startPreview: async () => {},
      quality: "hd",
      elapsedTime,
    });

  const { data, refetch } = useQuery<any, Error>({
    queryKey: ["interviewDetail", id],
    queryFn: () => interVierDetails(id),
    select: (data) => data.data,
  });

  const { mutate: mutateSubmitAnswers } = useMutation<
    any,
    Error,
    FormData,
    unknown
  >({
    mutationFn: (data: FormData) => candidateInterviewDetails(data),
    onSuccess: (res) => {
      if (
        nextQuestion ||
        (activeQuestionIndex === 0 &&
          !activeQuestion?.interviewResponse?.[0]?.endTime)
      ) {
        setLoading(false);
        setUploadFile(null);
        setAnswer("");
        refetch();
      }

      if (activeQuestionIndex === interviewData?.job?.questions?.length - 1) {
        toast.success("Interview Submitted");
        router.push("/candidates/interview-completed");
      }
    },
    onError: (error: Error) => {
      setLoading(false);
      toast.error(error.message);
    },
  });

  // Update refs when state changes
  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  useEffect(() => {
    uploadFileRef.current = uploadFile;
  }, [uploadFile]);

  const handleNextQuestion = useCallback(
    (checkAuto: boolean): void => {
      // if (activeQuestion?.type === "video" && !uploadFile && !checkAuto) {
      //   return toast.error("Please record your video response");
      // } else if (activeQuestion?.type === "text" && !answer && !checkAuto) {
      //   return toast.error("Please type your answer");
      // }
      setLoading(true);

      if (!interviewData || !activeQuestion) return;

      const currentAnswer = answerRef.current;
      const currentUploadFile = uploadFileRef.current;

      const interviewId = interviewData.id;
      const nextQuestionId =
        activeQuestionIndex + 1 < interviewData.job.questions.length
          ? interviewData.job.questions[activeQuestionIndex + 1].id
          : null;
      const questionId = activeQuestion.id;

      const formData = new FormData();

      formData.append("interviewId", interviewId?.toString());
      formData.append("response[questionId]", questionId?.toString());
      formData.append("response[answer]", currentAnswer);
      if (nextQuestionId != null)
        formData.append("nextQuestionId", nextQuestionId?.toString());
      if (nextQuestionId == null) formData.append("interviewStatus", "review");
      if (currentUploadFile) {
        formData.append("document", currentUploadFile);
      }
      mutateSubmitAnswers(formData);
      setNextQuestion(true);
    },
    [
      activeQuestion,
      uploadFile,
      answer,
      interviewData,
      activeQuestionIndex,
      mutateSubmitAnswers,
    ]
  );

  const handleStartQuestion = (data: InterviewData): void => {
    const interviewId = data?.id;
    const questionId = data?.job?.questions?.[activeQuestionIndex]?.id;
    const formData = new FormData();
    formData.append("interviewId", interviewId?.toString());
    formData.append("nextQuestionId", questionId?.toString());
    formData.append("interviewStatus", "in-progress");
    mutateSubmitAnswers(formData);
  };

  useEffect(() => {
    if (data && data.job.questions.length > 0) {
      let activeQuestionIndex = data?.job?.questions?.findIndex(
        (question: any) => question.interviewResponse?.[0]?.endTime == null
      );
      let checkIsInterviewStarted = data?.job?.questions?.find(
        (question: any) => question.interviewResponse?.[0]?.startTime
      );
      if (activeQuestionIndex === 0 && !checkIsInterviewStarted) {
        handleStartQuestion(data);
      }
      setActiveQuestionIndex(activeQuestionIndex);
      setActiveQuestion(data?.job?.questions?.[activeQuestionIndex]);
      setInterviewData(data);
    }
  }, [data]);

  useEffect(() => {
    // Initialize media stream when component mounts
    const initializeStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (error) {
        console.error("Error initializing media stream:", error);
        toast.error("Failed to access camera and microphone");
      }
    };

    initializeStream();

    return () => {
      stopStream();
    };
  }, []);

  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setAnswer(event.target.value);
  };

  const handleRecordAgain = (): void => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
  };

  return (
    <Box className="flex-grow">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-40">
          <LoadingSpinner isVisible={loading} />
        </div>
      )}
      <Grid
        container
        spacing={2}
        className="xl:max-h-screen lg:max-h-screen overflow-y-hidden"
      >
        <Grid size={12} className="bg-[#F6F6F6]">
          <Card className="shadow-none rounded-t-[35px]">
            <Grid container spacing={2}>
              <Grid
                size={{ sm: 4, xs: 4, md: 4, lg: 1, xl: 1 }}
                sx={{
                  justifyItems: "center",
                  borderRight: "1px solid #EAE9E994",
                }}
              >
                <Avatar
                  sx={{ width: 76, height: 76, backgroundColor: "white" }}
                  className="m-4"
                >
                  <VideocamIcon
                    style={{ color: "blue", width: 76, height: 76 }}
                  />
                </Avatar>
              </Grid>
              <Grid
                size={{ sm: 4, xs: 4, md: 4, lg: 9, xl: 9 }}
                sx={{ alignSelf: "center" }}
              >
                <h2 className="text-md font-medium">
                  Interview for:{interviewData?.job?.title}
                </h2>
                <p className="text-paragraphColor text-sm mb-0">
                  {interviewData
                    ? new Intl.DateTimeFormat("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }).format(new Date(interviewData.job?.endDate))
                    : ""}
                </p>
              </Grid>
              <Grid size={{ sm: 4, xs: 4, md: 4, lg: 2, xl: 2 }}>
                <Image
                  src={HEADER?.logo}
                  alt="VirtuHire"
                  width={170}
                  height={50}
                  className="mt-7 mb-2"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid
          size={{ sm: 12, xs: 12, md: 8, lg: 8, xl: 8 }}
          className="bg-[#F6F6F6] h-screen"
        >
          <div className="h-[390px] mt-2.5 m-2.5 relative bg-cover bg-no-repeat bg-center">
            <div className="flex justify-center  items-center w-[150px] h-[150px] rounded-full absolute right-10 top-1/2 transform -translate-y-1/2 z-50">
              {activeQuestion && (
                <InterviewTimer
                  key={`${activeQuestion.id}-${activeQuestion.interviewResponse?.[0]?.startTime}`}
                  interviewData={activeQuestion}
                  isRecording={recordingState?.isRecording}
                  stopRecording={stopRecording}
                  handleSubmit={handleNextQuestion}
                  questionType={activeQuestion?.type}
                />
              )}
            </div>
            {recordingState?.isRecording && (
              <div className=" flex w-[120px] items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white">
                  {formatTime(elapsedTime)} / {formatTime(30)}
                </span>
              </div>
            )}
            {QuestionType === "text" ? (
              <Card className="h-[390px] flex items-center justify-center relative">
                <Grid
                  container
                  spacing={2}
                  className="m-5 w-full items-center justify-center"
                >
                  <textarea
                    placeholder="Type your answer here"
                    className="w-[70%] h-[200px] border text-center bg-[#F6F6F6]"
                    value={answer || ""}
                    onChange={handleAnswerChange}
                  />
                </Grid>
              </Card>
            ) : (
              <div className="w-full h-[50vh]">
                {!videoUrl ? (
                  <VideoRecorder videoRef={videoRef} />
                ) : (
                  <div className="space-y-4 bg-black h-[50vh]">
                    <div className="rounded-lg overflow-hidden">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-[50vh] rounded-none object-contain"
                      >
                        <track kind="captions" />
                        Your browser does not support the video element.
                      </video>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Grid
            container
            spacing={2}
            sx={{ overflowY: "auto", maxHeight: "150px" }}
          >
            <Grid size={1}>
              <Avatar
                src="/images/avatar.svg"
                className="mt-10 m-6"
                sx={{ width: 86, height: 86 }}
              ></Avatar>
            </Grid>
            <Grid size={11}>
              <Card className="m-6 p-4 ml-10" sx={{ width: "40%" }}>
                <p className="text-sm font-bold">{activeQuestion?.title}</p>
              </Card>

              <Card className="m-6 p-4 ml-10" sx={{ maxWidth: "70%" }}>
                <p className="text-sm ">{activeQuestion?.description}</p>
              </Card>
              <Card className="m-6 p-4 ml-10" sx={{ maxWidth: "50%" }}>
                <p className="text-sm">
                  You will have {activeQuestion?.duration} minutes for this
                  question, and up to 3 takes.
                </p>
              </Card>
            </Grid>
          </Grid>
          <Card className="fixed bottom-0 xs:w-full sm:w-full xl:w-[65%] lg:w-[65%] z-[1000]">
            <Grid
              container
              spacing={2}
              className="m-5 text-center justify-center items-center"
            >
              {QuestionType === "video" && !videoUrl && (
                <RecordingControls
                  recordingState={recordingState}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  onTogglePause={togglePause}
                  onToggleMute={toggleMute}
                />
              )}

              {QuestionType === "video" && videoUrl && (
                <button
                  className="bg-primary text-white px-4 py-2 rounded-full h-[50px] w-[135px] "
                  onClick={handleRecordAgain}
                >
                  Record Again
                </button>
              )}

              <button
                className="bg-secondary text-white px-4 py-2 rounded-full h-[50px] w-[135px] "
                onClick={handleNextQuestion}
              >
                {activeQuestionIndex ===
                interviewData?.job?.questions?.length - 1
                  ? "End Interview"
                  : "Next Question"}
              </button>
            </Grid>
          </Card>
        </Grid>
        <Grid
          size={{ sm: 12, xs: 12, md: 4, lg: 4, xl: 4 }}
          className="bg-white"
        >
          <Card className="mt-2 m-4 p-4 font-bold text-md text-headingColor">
            Question details
          </Card>
          <div className="max-h-[400px] overflow-y-auto">
            {interviewData?.job?.questions?.map((item, index) => (
              <Card
                key={item?.id}
                className="mt-5 m-4"
                sx={{
                  borderRadius: "25px",
                  opacity: index === activeQuestionIndex ? 1 : 0.5,
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid size={2}>
                    {item?.type === "video" ? (
                      <Avatar
                        className="m-2"
                        style={{ backgroundColor: "#ffd484" }}
                      >
                        <VideoCall className="w-4 h-4 text-black " />
                      </Avatar>
                    ) : (
                      <Avatar
                        className="m-2"
                        style={{ backgroundColor: "#ffd484" }}
                      >
                        T
                      </Avatar>
                    )}
                  </Grid>
                  <Grid size={8} sx={{ alignSelf: "center" }}>
                    <p className="font-semibold text-sm mb-0">
                      Question no {index + 1}
                    </p>
                    <p className="text-sm mb-0">
                      This will be a {item?.type} question of {item?.duration}{" "}
                      minutes.
                    </p>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Interview;
