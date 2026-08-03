import { configureStore } from "@reduxjs/toolkit";
import authReducer  from "./CreateSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
