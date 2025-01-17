import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Box, Button, Card, CircularProgress, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { getJobDetail } from "../../../api/jobsApi";
import InterviewEquipmentTesting from "../../../app/candidates/interview-equipment-testing";
import {
  setFaqData,
  setHasVideoQuestion,
} from "../../../redux/slices/candidateQuestionSlice";
import { RootState } from "../../../redux/store";
import { UploadFileOutlined, Close } from "@mui/icons-material";
import { CandidateUploadResume } from "../../../api/candidatesRegistrationApi";
import { LoadingSpinner } from "../../common/LoadingSpinner";

const Questions = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [fileUploadStatus, setFileUploadStatus] = useState(true);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  const faqData = useSelector(
    (state: RootState) => state.questionRecords.faqData
  );
  const hasVideoQuestion = useSelector(
    (state: RootState) => state.questionRecords.hasVideoQuestion
  );
  const uuId = useSelector((state: RootState) => state.questionRecords.uuId);

  const { mutate: fetchJobDetail, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const response = await getJobDetail(id);
      return response.data;
    },
    onSuccess: (res) => {
      setInterviewData(res);
      if (res?.resumeStatus === "not-applicable") {
        setFileUploadStatus(false);
      }
      dispatch(setFaqData(res?.faq?.records || []));
      dispatch(setHasVideoQuestion(res?.hasVideoQuestion || false));
    },
    onError: (error) => {
      toast.error(
        error?.message || "An error occurred while fetching job details."
      );
    },
  });

  const { mutate: mutateUploadFile } = useMutation({
    mutationFn: (formData: FormData) => CandidateUploadResume(formData),
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      setIsLoading(false);
      setFileUploadStatus(false); // Hide upload card
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "File upload failed.");
    },
  });

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      setIsLoading(true);
      const formData = new FormData();
      formData.append("resume", file);
      mutateUploadFile(formData);
    } else {
      toast.error("Please upload a valid PDF file.");
      setIsLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    setFileUploadStatus(true); // Show upload card
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchJobDetail(uuId);
    }
  }, [id]);

  if (isPending) {
    return <LoadingSpinner isVisible={true} />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Card className="m-4">
            <Grid size={12}>
              <h1 className="text-lg font-bold m-4 text-headingColor">
                Equipment Testing
              </h1>
            </Grid>
            <Grid size={12}>
              <p className="text-sm m-4">
                Ensures optimal performance and reliability. For cameras, it
                focuses on image quality, resolution, color accuracy, low-light
                performance, and durability. Voice system testing evaluates
                audio clarity, noise cancellation, microphone sensitivity,
                latency, and speaker performance.
              </p>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Grid container>
        <Grid size={{ sm: 12, xs: 12, md: 8, lg: 8, xl: 8 }}>
          <Card className="m-4">
            <Grid container spacing={2}>
              <Grid size={12}>
                <h1 className="text-lg font-bold m-4 text-headingColor">
                  Interview Instruction
                </h1>
                {faqData && faqData.length > 0 ? (
                  faqData.map((faq) => (
                    <Card key={faq.id} className="m-4">
                      <Grid container spacing={2}>
                        <Grid size={12} sx={{ margin: "20px" }}>
                          <h1 className="text-md font-bold">{faq.title}</h1>
                          <p className="text-sm">{faq.description}</p>
                        </Grid>
                      </Grid>
                    </Card>
                  ))
                ) : (
                  <p>No FAQs available.</p>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid size={{ sm: 12, xs: 12, md: 4, lg: 4, xl: 4 }}>
          {fileUploadStatus && (
            <Card className="m-4">
              <Grid container spacing={2}>
                <Grid size={12}>
                  <h1 className="text-lg font-semibold m-4 text-headingColor">
                    Upload Resume
                  </h1>
                  <p className="text-sm m-4">
                    Upload your resume to showcase your skills, experience, and
                    achievements tailored to this job.
                  </p>
                </Grid>
                <Grid
                  size={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <input
                    type="file"
                    accept=".pdf, .doc, .docx"
                    style={{ display: "none" }}
                    id="resume-upload"
                    onChange={handleResumeUpload}
                    ref={fileInputRef}
                  />
                  <label htmlFor="resume-upload">
                    <Button
                      style={{
                        backgroundColor: "#F36B24",
                        borderRadius: "5px",
                        color: "white",
                        margin: "15px",
                        cursor: "pointer",
                      }}
                      fullWidth
                      component="span"
                      disabled={isLoading}
                    >
                      <UploadFileOutlined className="mr-2" />
                      {isLoading ? (
                        <CircularProgress size={24} className="text-white" />
                      ) : (
                        "Upload Resume"
                      )}
                    </Button>
                  </label>
                </Grid>
                {fileName && (
                  <Grid
                    size={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p className="mb-0 ml-4">{fileName}</p>
                    <IconButton
                      onClick={handleRemoveFile}
                      color="error"
                      sx={{ marginLeft: "10px" }}
                    >
                      <Close />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Card>
          )}

          <Card className="m-4">
            <Grid size={12}>
              <h1 className="text-lg font-semibold m-4 text-headingColor">
                Interview Details
              </h1>
            </Grid>

            <Grid size={12}>
              <Card
                sx={{
                  backgroundColor: "#F89C63",
                  textAlign: "center",
                  margin: "15px",
                  color: "white",
                }}
              >
                <h2 className="text-md  m-1">
                  Complete Before:{" "}
                  {interviewData
                    ? new Date(interviewData?.endDate).toLocaleDateString()
                    : ""}
                </h2>
              </Card>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
              <Grid size={6}>
                <Card
                  sx={{
                    backgroundColor: "#F89C63",
                    textAlign: "center",
                    margin: "15px",
                    color: "white",
                  }}
                >
                  <h2 className="text-md font-basic m-1">
                    {interviewData
                      ? `${interviewData?.totalTime} Minutes`
                      : `""Minutes`}
                  </h2>
                </Card>
              </Grid>
              <Grid size={6}>
                <Card
                  sx={{
                    backgroundColor: "#F89C63",
                    textAlign: "center",
                    margin: "15px",
                    color: "white",
                  }}
                >
                  <h2 className="text-md font-basic m-1">
                    {interviewData
                      ? `${interviewData?.totalQuestions} Questions`
                      : `Questions""`}
                  </h2>
                </Card>
              </Grid>
            </Grid>
            {hasVideoQuestion && <InterviewEquipmentTesting />}
            <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                style={{
                  backgroundColor: fileUploadStatus ? "#B0B0B0" : "#F36B24",
                  borderRadius: "5px",
                  color: "white",
                  margin: "15px",
                  cursor: fileUploadStatus ? "not-allowed" : "pointer",
                }}
                fullWidth
                onClick={() =>
                  router.push(`/candidates/interview/${interviewData?.uuid}`)
                }
                disabled={fileUploadStatus}
              >
                Begin Interview
              </Button>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Questions;
