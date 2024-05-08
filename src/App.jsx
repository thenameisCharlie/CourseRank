import { useState } from "react";
import { supabase } from "./client";
import CourseList from "./components/CourseList";
import MajorList from "./components/MajorList";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [selectedMajor, setSelectedMajor] = useState(null);

  const handleMajorChange = (majorId) => {
    setSelectedMajor(majorId);
  };
  return (
    <div>
      <Navbar />
      <h1 className="title-name">Course Rank</h1>
      <MajorList onMajorChange={handleMajorChange} />
      <CourseList selectedMajor={selectedMajor} />
    </div>
  );
}

export default App;
