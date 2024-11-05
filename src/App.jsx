import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseList from "./components/CourseList";
import MajorList from "./components/MajorList";
import Navbar from "./components/Navbar";
import "./styles/App.css";

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
      <div className="app-container">
        <h1 className="title-name">
          Course<span className="highlight">Rank</span>
        </h1>
        <p className="subtitle-text">Choose a course to rank</p>
        <MajorList onMajorChange={handleMajorChange} />
        <CourseList
          selectedMajor={selectedMajor}
          onCourseChange={handleCourseChange}
        />
        <button className="search-button" onClick={handleNavigate}>
          Search
        </button>
      </div>
    </div>
  );
}

export default App;
