import { configureStore } from "@reduxjs/toolkit";
import organizationRegistrationSlice from "../redux/slices/organizationRegistrationSlice";
import questionRecordSlice from "./slices/candidateQuestionSlice";
import createInterviewSlice from "./slices/createInterviewSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      organizationRegistration: organizationRegistrationSlice,
      questionRecords: questionRecordSlice,
      createInterview: createInterviewSlice, 
    },
  });
};

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
