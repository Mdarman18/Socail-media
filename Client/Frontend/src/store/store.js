import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./CreateSlice";
import storageModule from "redux-persist/lib/storage";

const storage = storageModule.default || storageModule;
import { persistReducer, persistStore } from "redux-persist";
const persistConfig = {
  key: "root",
  storage,
};
const persistedReducers = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: { auth: persistedReducers },
});
export const persistor = persistStore(store);
