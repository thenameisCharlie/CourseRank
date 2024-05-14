import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../client";
import Navbar from "../components/Navbar";

const ReadCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState([]);
  const [rating, setRating] = useState([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id);
      if (error) console.log("error", error);
      else setCourse(data);
    };

    fetchCourseData();
  }, [id]);

  useEffect(() => {
    const fetchRatingData = async () => {
      const { data, error } = await supabase
        .from("course_ratings")
        .select("*")
        .eq("course_id", id);
      if (error) console.log("error", error);
      else setRating(data);
    };

    fetchRatingData();
  }, [id]);

  const getAverageRating = (ratings) => {
    if (ratings.length === 0) {
      return 0;
    }
    // Sum of all ratings.
    const total = ratings.reduce((acc, curr) => acc + curr.rating_value, 0); //0 is the initial value of the accumulator. Acc is the accumulator and curr is the current value.
    return (total / ratings.length).toFixed(1); //toFixed(1) rounds the number to 1 decimal place.
  };

  const getAverageDifficulty = (ratings) => {
    if (rating === 0) {
      return 0;
    }

    const total = ratings.reduce((acc, curr) => acc + curr.difficulty, 0);
    return (total / ratings.length).toFixed(0);
  };

  return (
    <div>
      <Navbar />
      <div className="course-information">
        {course.map((course) => (
          <div key={course.id}>
            <h2>{course.title}</h2>
            <p>{course.course}</p>
          </div>
        ))}
      </div>
      <div className="course-ratings">
        <h3>Course Ratings</h3>
        <ul className="ratings-list">
          {rating.length > 0 ? (
            <>
              <li>Average rating: {getAverageRating(rating)}</li>
              <li>Course difficulty: {getAverageDifficulty(rating)}</li>
            </>
          ) : (
            <li>No ratings yet</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ReadCourse;
