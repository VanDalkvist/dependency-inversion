import React from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import App from "./App";
import "./styles.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <App />
    </MotionConfig>
  </React.StrictMode>,
);
