import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer, postReducer } from "./CreateSlice";
import storageModule from "redux-persist/lib/storage";

const storage = storageModule.default || storageModule;
import { persistReducer, persistStore } from "redux-persist";
const persistConfig = {
  key: "root",
  storage,
};
const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
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
