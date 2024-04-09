import { useState } from "react";
import { supabase } from "./client";
import CourseList from "./components/CourseList";
import MajorList from "./components/MajorList";
import "./App.css";

function App() {
  const [selectedMajor, setSelectedMajor] = useState(null);

  const handleMajorChange = (majorId) => {
    setSelectedMajor(majorId);
  };
  return (
    <div>
      <h1>Course Rank</h1>
      <MajorList onMajorChange={handleMajorChange} />
      <CourseList selectedMajor={selectedMajor} />
    </div>
  );
}

export default App;
