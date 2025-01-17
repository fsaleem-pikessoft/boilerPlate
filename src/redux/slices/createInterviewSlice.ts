import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreateInterviewState {
  stepOne: {
    title: string;
    salary: string;
    department: string;
  };
  stepTwo: {
    jobStatus: string;
    branchValue: number;
    resumeStatus: string;
    startDate: string | null;
    endDate: string | null;
    industryId: number | null;
  };
  stepThree: {
    description: string;
  };
}

const initialState: CreateInterviewState = {
  stepOne: {
    title: "",
    salary: "",
    department: "",
  },
  stepTwo: {
    jobStatus: "",
    branchValue: 0,
    resumeStatus: "",   
    startDate: null,
    endDate: null,
    industryId: null,
  },
  stepThree: {
    description: "",
  },
};

const createInterviewSlice = createSlice({
  name: "createInterview",
  initialState,
  reducers: {
    updateStepOne(state, action: PayloadAction<{ field: string; value: string }>) {
      state.stepOne[action.payload.field] = action.payload.value;
    },
    updateStepTwo(state, action: PayloadAction<{ field: string; value: any }>) {
      state.stepTwo[action.payload.field] = action.payload.value;
    },
    updateStepThree(state, action: PayloadAction<string>) {
      state.stepThree.description = action.payload;
    },
    resetForm(state) {
      state.stepOne = { title: "", salary: "", department: "" };
      state.stepTwo = { jobStatus: "", branchValue: 0, resumeStatus: "", startDate: null, endDate: null,industryId:null };
      state.stepThree = { description: "" };
    },
  },
});

export const { updateStepOne, updateStepTwo, updateStepThree, resetForm } = createInterviewSlice.actions;

export default createInterviewSlice.reducer;
