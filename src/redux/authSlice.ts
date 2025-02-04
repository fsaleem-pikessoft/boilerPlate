import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
}

const initialState = {
  hardcodedEmail: "admin123@gmail.com",
  hardcodedPassword: "12345",
  user: null as User | null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export const selectAuth = (state: any) => state.auth;

export default authSlice.reducer; 