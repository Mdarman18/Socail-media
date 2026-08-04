import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginInput: {
    email: "",
    password: "",
  },
  SigninInput: {
    username: "",
    email: "",
    password: "",
  },
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SetlogininInput: (state, action) => {
      const { field, value } = action.payload;
      state.loginInput[field] = value;
    },

    clearLoginInput: (state) => {
      state.loginInput = {
        email: "",
        password: "",
      };
    },

    SetSigninInput: (state, action) => {
      const { field, value } = action.payload;
      state.SigninInput[field] = value;
    },

    clearSignInput: (state) => {
      state.SigninInput = {
        username: "",
        email: "",
        password: "",
      };
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  SetlogininInput,
  clearLoginInput,
  SetSigninInput,
  clearSignInput,
  loginSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
