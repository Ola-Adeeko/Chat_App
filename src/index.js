import React from "react";
import ReactDOM from "react-dom";

import { ContextProvider } from "./SocketContext";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
