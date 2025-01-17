import { createSlice } from "@reduxjs/toolkit";

export const OrganizationRegistrationSlice = createSlice({
  name: "OrganizationRegistration",
  initialState: {
    userDetail: {
      firstName: "",
      lastName: "",
      email: "",
      Password: "",
    },
    companyName: "",
    companyAdress: "",
    country: "",
    employeeRange: "",
    industry: [],
    branchName: "",
    companyNameError: false,
    newHire: 1,
  },
  reducers: {
    setCompanyNameError: (state, action) => {
      state.companyNameError = action.payload;
    },
    setUserDetail: (state, action) => {
      state.userDetail = action.payload;
    },
    setCompanyName: (state, action) => {
      state.companyName = action.payload;
    },
    setCompanyAdress: (state, action) => {
      state.companyAdress = action.payload;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
    },
    setEmployeeRange: (state, action) => {
      state.employeeRange = action.payload;
    },
    setIndustry: (state, action) => {
      state.industry = action.payload;
    },
    setBranchName: (state, action) => {
      state.branchName = action.payload;
    },
    setNewHire: (state, action) => {
      state.newHire = action.payload;
    },
  },
});

export const {
  setUserDetail,
  setBranchName,
  setCompanyAdress,
  setCompanyName,
  setCountry,
  setEmployeeRange,
  setIndustry,
  setNewHire,
  setCompanyNameError,
} = OrganizationRegistrationSlice.actions;

export default OrganizationRegistrationSlice.reducer;
