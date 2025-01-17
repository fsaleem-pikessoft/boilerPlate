import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button, Card, CircularProgress, Chip } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { toast } from "react-toastify";
import { getJobsById } from "../../../api/jobsApi";
import { Job } from "../../../utils/interfaces/applyNowInterfaces";
import { HEADER } from "../../../utils/common";
import {
  setUserId,
  setUuId,
} from "../../../redux/slices/candidateQuestionSlice";
import { LoadingSpinner } from "../../common/LoadingSpinner";

interface Jobs {
  id: string;
}

const ApplyNow = () => {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isApplyNow, setIsApplyNow] = useState(false);
  const [job, setJob] = useState<Job | null>(null);

  const { mutate: mutateGetJobs, isPending } = useMutation({
    mutationFn: (jobId: Jobs) => getJobsById(jobId.id),
    onSuccess: (response) => {
      dispatch(setUuId(response?.data?.uuid));
      dispatch(setUserId(response?.data?.id));
      setJob(response.data);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });

  useEffect(() => {
    if (typeof id === "string") {
      mutateGetJobs({ id: "7db3326f-7988-4f3b-a2fe-b29871a98ece" });
    }
  }, [id, mutateGetJobs]);

  const handleApplyNow = () => {
    setIsApplyNow(true);
    router.push(`/candidates/registration/${id}`);
  };

  const renderHTML = (html: string) => ({ __html: html });

  if (isPending) {
    return <LoadingSpinner isVisible={true} />;
  }

  const isDateExceeded =
    job?.endDate && new Date(job.endDate).getTime() < new Date().getTime();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} className="m-4">
        <Grid
          size={{ sm: 12, xs: 12, md: 8, lg: 8, xl: 8 }}
          container
          spacing={2}
        >
          <Card>
            {job && (
              <Grid container spacing={2} className="m-4">
                <Grid size={{ sm: 12, xs: 12, md: 12, lg: 10, xl: 10 }}>
                  <h2 className="text-headingColor font-bold text-lg">
                    {job.title}
                  </h2>
                </Grid>
                <Grid
                  size={{ sm: 12, xs: 12, md: 12, lg: 2, xl: 2 }}
                  className="self-center"
                >
                  <Button
                    type="submit"
                    disabled={isApplyNow || isDateExceeded}
                    className="h-[31px] w-[130px] text-sm"
                    sx={{
                      backgroundColor:
                        isApplyNow || isDateExceeded ? "#ccc" : "#F36B24",
                      color: "#fff",
                      cursor:
                        isApplyNow || isDateExceeded
                          ? "not-allowed"
                          : "pointer",
                    }}
                    onClick={handleApplyNow}
                  >
                    {isApplyNow ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                  {isDateExceeded && (
                    <Chip
                      label="Interview Expired"
                      style={{ backgroundColor: "#F36B24", color: "white" }}
                      className="mt-2"
                    />
                  )}
                </Grid>

                <Grid size={4}>
                  <p className="text-paragraphColor font-semibold text-sm">
                    Start Date:{" "}
                    <span className="text-black pl-2">
                      {job?.startDate &&
                        new Date(job?.startDate).toISOString().split("T")[0]}
                    </span>
                  </p>
                </Grid>
                <Grid size={4}>
                  <p className="text-paragraphColor font-semibold text-sm">
                    Deadline:{" "}
                    <span className="text-black pl-2">
                      {job.endDate &&
                        new Date(job.endDate).toISOString().split("T")[0]}
                    </span>
                  </p>
                </Grid>
                <Grid size={4}></Grid>

                <Grid size={4}>
                  <p className="text-paragraphColor font-semibold text-sm">
                    Salary Range:
                    <span className="text-black pl-2">
                      {new Intl.NumberFormat().format(job.salary)}
                    </span>
                  </p>
                </Grid>
                <Grid size={4}>
                  <p className="text-paragraphColor font-semibold text-sm">
                    Industry:
                    <span className="text-black pl-2">{job.department}</span>
                  </p>
                </Grid>
              </Grid>
            )}

            {job && (
              <Grid container spacing={2} className="m-4">
                <Grid size={{ xs: 12, md: 12 }}>
                  <div
                    dangerouslySetInnerHTML={renderHTML(job.description || "")}
                  ></div>
                </Grid>
              </Grid>
            )}
          </Card>
        </Grid>
        <Grid
          size={{ sm: 12, xs: 12, md: 4, lg: 4, xl: 4 }}
          container
          spacing={2}
        >
          <Card>
            {job && (
              <Grid container spacing={2} className="m-4">
                <Grid size={{ xs: 12, md: 12 }}>
                  <Image
                    src={HEADER?.logo}
                    alt="VirtuHire"
                    width={170}
                    height={50}
                    className="mt-7 mb-2"
                  />
                </Grid>
                <Grid>
                  <p className="m-4">
                    VirtuHire is a cloud-based, dynamic software solution
                    produced by Cloud Shift Inc. It gives businesses the ability
                    to create exceptional teams through a streamlined, engaging
                    and innovative online recruitment platform.
                  </p>
                </Grid>
              </Grid>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApplyNow;
