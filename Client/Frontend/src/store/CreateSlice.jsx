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
    likePost: (state, action) => {
      const updatedPost = action.payload;

      const index = state.userPosts.findIndex(
        (post) => post._id === updatedPost._id,
      );

      if (index !== -1) {
        state.userPosts[index] = updatedPost;
      }
    },
    deletePost: (state, action) => {
      state.userPosts = state.userPosts.filter(
        (post) => post._id !== action.payload,
      );
    },
  },
});

export const { setPosts, addPost, deletePost, likePost } = postSlice.actions;

export const postReducer = postSlice.reducer;
const initialProfileState = {
  userProfile: [],
  isFollowing: false,
  follow: true,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialProfileState,

  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});
// =========----------  for comment ------===========
export const commentReducers = createSlice({
  name: "comment",

  initialState: {
    usercomment: [],
    text: "",
  },

  reducers: {
    setuserComment: (state, action) => {
      state.usercomment = action.payload;
    },

    addComment: (state, action) => {
      state.usercomment.push(action.payload);
    },

    clearComment: (state) => {
      state.usercomment = [];
    },
  },
});

export const { setuserComment, addComment, clearComment } =
  commentReducers.actions;

export const commentReducer = commentReducers.reducer;
// export const { setUserProfile, updateFollowStatus } = profileSlice.actions;
export const { setUserProfile } = profileSlice.actions;
export const profileReducers = profileSlice.reducer;
