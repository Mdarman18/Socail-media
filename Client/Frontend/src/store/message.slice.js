import { createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: "message",

  initialState: {
    socket: null,
    onlineUser: [],
    message: [],
  },

  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    setonlineUser: (state, action) => {
      state.onlineUser = Array.isArray(action.payload) ? action.payload : [];
    },

    // Chat history load karte waqt
    setMessage: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.message = action.payload;
      } else if (action.payload && Array.isArray(action.payload.messages)) {
        state.message = action.payload.messages;
      } else {
        state.message = [];
      }
    },

    // Real-time naya message add karne ke liye
    addMessage: (state, action) => {
      if (!Array.isArray(state.message)) {
        state.message = [];
      }

      const newMsg = action.payload;
      if (!newMsg) return;

      // Duplicate message aane se rokne ke liye
      const isDuplicate = state.message.some(
        (m) =>
          m._id && newMsg._id && m._id.toString() === newMsg._id.toString(),
      );

      if (!isDuplicate) {
        state.message.push(newMsg);
      }
    },
  },
});

export const { setSocket, setonlineUser, setMessage, addMessage } =
  messageSlice.actions;

export const messageReducer = messageSlice.reducer;
