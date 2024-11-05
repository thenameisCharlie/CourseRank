import React, { useState } from "react";
import { supabase } from "../client";
import Navbar from "../components/Navbar";

const RateCourse = () => {
  const [courseId, setCourseId] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("course_rating")
      .insert([{ course_id: courseId, rating, feedback }]);

    if (error) {
      console.error("Error uploading rating:", error);
    } else {
      console.log("Rating uploaded successfully:", data);
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h1>Rate a Course</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Course ID:</label>
            <input
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Rating:</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min="1"
              max="5"
              required
            />
          </div>
          <div>
            <label>Feedback:</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          <button type="submit">Submit Rating</button>
        </form>
      </div>
    </>
  );
};

export default RateCourse;
