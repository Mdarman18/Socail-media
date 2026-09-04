import { combineReducers, configureStore } from "@reduxjs/toolkit";

import {
  authReducer,
  commentReducer,
  postReducer,
  profileReducers,
  communityReducer,
  studySharpReducer,
} from "./CreateSlice";

import storageModule from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import { messageReducer } from "./Message";

const storage = storageModule.default || storageModule;

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["message"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  profile: profileReducers,
  message: messageReducer,
  comment: commentReducer,
  community: communityReducer,
  studysharp: studySharpReducer,
});

const persistedReducers = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducers,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
