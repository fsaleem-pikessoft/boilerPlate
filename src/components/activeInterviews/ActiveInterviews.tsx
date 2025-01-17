import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getAllJobs } from "../../api/jobsApi";
import { toast } from "react-toastify";

const ActiveInterviews = () => {
  const [activeJobs, setActiveJobs] = useState([]);

  const { mutate: mutateGetAllJobs } = useMutation({
    mutationFn: () => getAllJobs(),
    onSuccess: (res) => {
      setActiveJobs(res?.data?.records);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  useEffect(() => {
    mutateGetAllJobs();
  }, []);

  return (
    <TableContainer component={Paper} className="mt-10">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Title</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Salary</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Department</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Intro URL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activeJobs.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row?.title}</TableCell>
              <TableCell>{row?.salary}</TableCell>
              <TableCell>{row?.department}</TableCell>
              <TableCell>
                <a href="" rel="">
                  {row?.introUrl}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default ActiveInterviews;
