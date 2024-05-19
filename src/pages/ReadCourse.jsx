import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../client";
import Navbar from "../components/Navbar";

const ReadCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState([]);
  const [rating, setRating] = useState([]);

  //fetch the course data from the database
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

  //fetch the ratings of the course from the database
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

  //get the average rating of the course of all users
  const getAverageRating = (ratings) => {
    if (ratings.length === 0) {
      return 0;
    }
    // Sum of all ratings.
    const total = ratings.reduce((acc, curr) => acc + curr.rating_value, 0); //0 is the initial value of the accumulator. Acc is the accumulator and curr is the current value.
    return (total / ratings.length).toFixed(1); //toFixed(1) rounds the number to 1 decimal place.
  };

  //get the difficulty average rating from all users
  const getAverageDifficulty = (ratings) => {
    if (rating === 0) {
      return 0;
    }

    const total = ratings.reduce((acc, curr) => acc + curr.difficulty, 0);
    return (total / ratings.length).toFixed(0);
  };

  // const countRatings = (ratings) => {
  //   return ratings.reduce((acc, curr) => {
  //     acc[curr.rating_value] = (acc[curr.rating_value] || 0) + 1;
  //     return acc;
  //   }, {});
  // };

  const countRatings = (ratings) => {
    ratings.forEach((acc, curr) => {
      acc = acc + curr.rating_value;
      return acc;
    });
  };

  //format the date to a more readable format for users.
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }; //options for the date format
    return new Date(dateString).toLocaleDateString(undefined, options); //toLocaleDateString() returns a string with a language sensitive representation of the date portion of this date.
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
        <h2>Course Ratings</h2>
        <ul className="ratings-list">
          {rating.length > 0 ? (
            <>
              <h3 className="course-rating">
                Average rating: {getAverageRating(rating)}⭐
              </h3>
              <h3 className="course-difficulty">
                Course difficulty: {getAverageDifficulty(rating)}
              </h3>
              <h4 className="course-comments">Comments</h4>
              {rating.map((rating) => (
                <li key={rating.id}>
                  Rating:{rating.rating_value}
                  <br />
                  {rating.comment}
                  <br />
                  {formatDate(rating.created_at)}
                  <br />
                  <br />
                </li>
              ))}
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
