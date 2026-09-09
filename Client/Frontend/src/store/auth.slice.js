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
const initialState = {
  isCreateModalOpen: false, // Yeh state check karegi ki modal open hai ya nahi
};

export const createPostSlice = createSlice({
  name: "createModel",
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    // Modal band karne ke liye
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },
  },
});

export const { openCreateModal, closeCreateModal } = createPostSlice.actions;
export const createModelReducer = createPostSlice.reducer;

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

// Profile State & Slice
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

export const { setUserProfile } = profileSlice.actions;
export const profileReducers = profileSlice.reducer;

// Comment Slice
export const commentReducers = createSlice({
  name: "comment",
  initialState: {
    usercomment: [],
    text: "",
  },
  reducers: {
    setuserComment: (state, action) => {
      state.usercomment = action.payload || [];
    },

    addComment: (state, action) => {
      state.usercomment.push(action.payload);
    },

    clearComment: (state) => {
      state.usercomment = [];
    },
    addUpvote: (state, action) => {
      const { commentId, upVote } = action.payload;
      const comment = state.usercomment.find((item) => item._id === commentId);

      if (!comment) return;

      comment.upvote = upVote;
    },
  },
});

export const { setuserComment, addComment, clearComment, addUpvote } =
  commentReducers.actions;
export const commentReducer = commentReducers.reducer;

// ==========================================
// 🚀 Community Slice (Alag kiya gaya naya slice)
// ==========================================
const initialCommunityState = {
  communities: [],
  loading: false,
  error: null,
};

const communitySlice = createSlice({
  name: "community",
  initialState: initialCommunityState,
  reducers: {
    setCommunities: (state, action) => {
      state.communities = action.payload;
    },
    addCommunity: (state, action) => {
      state.communities.unshift(action.payload);
    },
    joinCommunitySuccess: (state, action) => {
      const updatedCommunity = action.payload;
      const index = state.communities.findIndex(
        (comm) => comm._id === updatedCommunity._id,
      );
      if (index !== -1) {
        state.communities[index] = updatedCommunity;
      }
    },
  },
});

export const { setCommunities, addCommunity, joinCommunitySuccess } =
  communitySlice.actions;
export const communityReducer = communitySlice.reducer;

// ==========================================
// 🚀 StudySharp State & Slice (Modals & Search Data)
// ==========================================
const initialStudySharpState = {
  isSearchModalOpen: false,
  isCreateModalOpen: false,
  isStudyModalOpen: false,
  isHelpModalOpen: false,
  students: [],
  doubts: [],
  resources: [],
};

const studySharpSlice = createSlice({
  name: "studysharp",
  initialState: initialStudySharpState,
  reducers: {
    setIsSearchModalOpen: (state, action) => {
      state.isSearchModalOpen = action.payload;
    },
    setIsCreateModalOpen: (state, action) => {
      state.isCreateModalOpen = action.payload;
    },
    setIsStudyModalOpen: (state, action) => {
      state.isStudyModalOpen = action.payload;
    },
    setIsHelpModalOpen: (state, action) => {
      state.isHelpModalOpen = action.payload;
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setDoubts: (state, action) => {
      state.doubts = action.payload;
    },
    setResources: (state, action) => {
      state.resources = action.payload;
    },
  },
});

export const {
  setIsSearchModalOpen,
  setIsCreateModalOpen,
  setIsStudyModalOpen,
  setIsHelpModalOpen,
  setStudents,
  setDoubts,
  setResources,
} = studySharpSlice.actions;

export const studySharpReducer = studySharpSlice.reducer;

// Selectors
export const selectSearchModalOpen = (state) =>
  state.studysharp.isSearchModalOpen;
export const selectStudents = (state) => state.studysharp.students;
export const selectDoubts = (state) => state.studysharp.doubts;
export const selectPosts = (state) => state.post.userPosts;
// Updated selector source from studysharp to community slice
export const selectCommunities = (state) => state.community.communities;
export const selectResources = (state) => state.studysharp.resources;

export const selectCreateModalOpen = (state) =>
  state.studysharp.isCreateModalOpen;
export const selectStudyModalOpen = (state) =>
  state.studysharp.isStudyModalOpen;
export const selectHelpModalOpen = (state) => state.studysharp.isHelpModalOpen;
