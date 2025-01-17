import { createSlice } from "@reduxjs/toolkit";

export const QuestionRecordsSlice = createSlice({
  name: "QuestionRecords",
  initialState: {
    questionsRecord: [],
    faqData: [],
    hasVideoQuestion: false,   
    uuId:"",
    userId:0,
  },
  reducers: {
    setQuestionRecords: (state, action) => {
      state.questionsRecord = action.payload;
    },
    setFaqData: (state, action) => {
      state.faqData = action.payload;
    },
    setHasVideoQuestion: (state, action) => {
      state.hasVideoQuestion = action.payload;
    },
    setUuId: (state, action) => {
      state.uuId = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { setQuestionRecords, setFaqData, setHasVideoQuestion,setUuId,setUserId} = QuestionRecordsSlice.actions;

export default QuestionRecordsSlice.reducer;
