import React from "react";
import ReactDOM from "react-dom/client";
import Auth from "./auth.tsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth />
  </React.StrictMode>
);
