import React, {StrictMode} from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {BrowserRouter} from "react-router-dom";
import {RecoilRoot} from "recoil";
import {io} from "socket.io-client";

const socket = io("http://localhost:3000");
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <RecoilRoot>
      <App socket={socket} />
    </RecoilRoot>
  </BrowserRouter>
);
