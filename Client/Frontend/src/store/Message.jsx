import { createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: "message",

  initialState: {
    socket: null,
    onlineUser: [],
  },

  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    setonlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
  },
});

export const { setSocket, setonlineUser } = messageSlice.actions;

export const messageReducer = messageSlice.reducer;
