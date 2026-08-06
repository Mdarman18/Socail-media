import { createSlice } from "@reduxjs/toolkit";

// Auth State
const initialAuthState = {
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
  loading: false,
  error: null,
};

// Auth Slice
export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
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

export const authReducer = authSlice.reducer;

// Post State
const initialPostState = {
  userPosts: [],
  loading: false,
  error: null,
};

// Post Slice
export const postSlice = createSlice({
  name: "post",
  initialState: initialPostState,
  reducers: {
    setPosts: (state, action) => {
      state.userPosts = action.payload;
    },

    addPost: (state, action) => {
      state.userPosts.unshift(action.payload);
    },

    deletePost: (state, action) => {
      state.userPosts = state.userPosts.filter(
        (post) => post._id !== action.payload,
      );
    },
  },
});

export const { setPosts, addPost, deletePost } = postSlice.actions;

export const postReducer = postSlice.reducer;
