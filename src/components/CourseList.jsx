import React, { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../client";

const CourseList = ({ selectedMajor, onCourseChange }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(" ");

  useEffect(() => {
    const fetchCourses = async () => {
      let query = supabase.from("courses").select("*");

      // If a major is selected, add a filter to the query
      if (selectedMajor) {
        query = query.eq("major_id", selectedMajor);
      }

      const { data, error } = await query;
      if (error) console.log("error", error);
      else setCourses(data);
    };

    if (selectedMajor) {
      fetchCourses();
    } else {
      setCourses([]);
    }
  }, [selectedMajor]);

  // Handle the course change event
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    onCourseChange(event.target.value);
  };

  //Sort courses in alphabetical order
  courses.sort((a, b) => a.title.localeCompare(b.title)); //These two functions together sort the courses in alphabetical order.

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
    </div>
  );
};
export default CourseList;
