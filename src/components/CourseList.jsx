import React, { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../client";

const CourseList = ({ selectedMajor }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(" ");

  useEffect(() => {
    const fetchCourses = async () => {
      // If a major is selected, fetch courses for that major
      if (selectedMajor) {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("major_id", selectedMajor);
      }

      if (error) console.log("error", error);
      else setCourses(data);
    };

    if (selectedMajor) {
      fetchCourses();
    } else {
      setCourses([]);
    }
  }, [selectedMajor]);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <div>
      <label htmlFor="course-select">Choose a course:</label>
      <select
        id="course-select"
        value={selectedCourse}
        onChange={handleCourseChange}
        disabled={!selectedMajor}
      >
        <option value="">Select a course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>
      {selectedCourse && <div>You have selected: {selectedCourse}</div>}
    </div>
  );
};
export default CourseList;
