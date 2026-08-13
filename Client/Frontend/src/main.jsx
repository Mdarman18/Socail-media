import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { SocketContextProvider } from "./context/SocketContext.jsx"; // 👈 Context import karein

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketContextProvider>
          {/* 👈 Yahan wrap karein */}
          <App />
        </SocketContextProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
