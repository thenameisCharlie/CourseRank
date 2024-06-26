import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseList from "./components/CourseList";
import MajorList from "./components/MajorList";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const navigate = useNavigate(); //useNavigate is a hook that allows you to navigate to a different page in your application.

  //set the selected major id
  const handleMajorChange = (majorId) => {
    setSelectedMajor(majorId);
  };

  //set the selected course id
  const handleCourseChange = (courseId) => {
    setSelectedCourseId(courseId);
  };

  //navigate to the view page of the selected course
  const handleNavigate = () => {
    if (selectedCourseId) {
      navigate(`/view/${selectedCourseId}`);
    } else {
      alert("Please select a course first");
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="title-name">Course Rank</h1>
      <MajorList onMajorChange={handleMajorChange} />
      <CourseList
        selectedMajor={selectedMajor}
        onCourseChange={handleCourseChange}
      />
      <button onClick={handleNavigate}>View Course</button>
    </div>
  );
}

export default App;
