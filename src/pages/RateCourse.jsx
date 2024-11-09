import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import Navbar from "../components/Navbar";
import { Navigate, useParams } from "react-router-dom";
import RatingReview from "../components/RatingReview";
import "../styles/RateCourse.css";

const RateCourse = () => {
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [userData, setUserData] = useState(null);
  const { id } = useParams(); // course id

  const isFormComplete = rating !== 0 && difficulty !== 0;

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        handleSignout();
      } else if (user) {
        setUserData(user);
      }
    };

    fetchUser();
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // To prevent the user from submitting if they dont have an account
    if (!userData) {
      alert("You must be logged in to rate a course");
      return;
    }

    // Check if they have already submitted a post for the course by checking their user id
    // if they have - then alert them and return
    const { data: existingRating, error: existingRatingError } = await supabase
      .from("course_ratings")
      .select("*")
      .eq("course_id", id)
      .eq("user_id", userData.id);

    if (existingRatingError) {
      console.error("Error deleting existing rating:", existingRatingError);
    } else if (existingRating.length > 0) {
      console.log("Existing rating found:", existingRating);
      alert("You have already rated this course.");
      return;
    }

    const { data, error } = await supabase.from("course_ratings").insert([
      {
        comment: feedback,
        course_id: id,
        rating_value: rating,
        difficulty,
        user_id: userData.id,
      },
    ]);

    if (error) {
      console.error("Error uploading rating:", error);
    } else {
      console.log("Rating uploaded successfully!", data);
      window.location.href = `/view/${id}`;
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <form onSubmit={handleSubmit}>
          <div className="rate-course-form">
            <label>Rate this Course</label>
            <RatingReview rating={rating} setRating={setRating} />
          </div>
          <div className="rate-difficulty-form">
            <label>Course Difficulty</label>
            <RatingReview rating={difficulty} setRating={setDifficulty} />
          </div>
          <div className="review-form">
            <label>Write your Review</label>
            <textarea
              value={feedback}
              className="review-input"
              placeholder="What information can you provide other students regarding this class?"
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </div>
          <button
            className="submit-button"
            type="submit"
            disabled={!isFormComplete}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default RateCourse;
