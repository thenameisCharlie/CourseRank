import { useState } from "react";
import { supabase } from "./client";
import CourseList from "./components/CourseList";
import "./App.css";

function App() {
  return (
    <div>
      <h1>Course List</h1>
      <CourseList />
    </div>
  );
}

export default App;
