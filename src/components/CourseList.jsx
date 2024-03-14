import React from "react";
import { useState } from "react";
import { supabase } from "../client";

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) console.log("error", error);
    else setCourses(data);
    console.log(data);
  };

  return (
    <div>
      <button onClick={fetchCourses}>Fetch Courses</button>
      {courses.map((course) => (
        <p key={course.id}>{course.title}</p>
      ))}
    </div>
  );
};
export default CourseList;
