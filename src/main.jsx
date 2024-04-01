import React, {StrictMode} from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {BrowserRouter} from "react-router-dom";
import {RecoilRoot} from "recoil";
import {io} from "socket.io-client";

const socket = io("https://collab-canvas-backend.vercel.app");
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <RecoilRoot>
      <App socket={socket} />
    </RecoilRoot>
  </BrowserRouter>
);
