import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Router, Route, BrowserRouter, Routes } from "react-router-dom";
import ReadCourse from "./pages/ReadCourse.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/view/:id" element={<ReadCourse />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
