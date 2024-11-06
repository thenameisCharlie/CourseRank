import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../client";
import Navbar from "../components/Navbar";
import CommentCard from "../components/CommentCard";
import "../styles/ReadCourse.css";

const ReadCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState([]);
  const [rating, setRating] = useState([]);
  const [professor, setProfessor] = useState([]);
  const [sortRatings, setSortRatings] = useState([]); //sortReviews can be ["date", "highest", "lowest"
  const [sortCriterion, setSortCriterion] = useState("date"); //criteria can be ["rating", "difficulty", "date"
  // const [professor, setProfessor] = useState([]);
  const [fiveStarRatings, setFiveStarRatings] = useState(0);
  const [fourStarRatings, setFourStarRatings] = useState(0);
  const [threeStarRatings, setThreeStarRatings] = useState(0);
  const [twoStarRatings, setTwoStarRatings] = useState(0);
  const [oneStarRatings, setOneStarRatings] = useState(0);

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

  //count the number of ratings for each rating value
  useEffect(() => {
    // Update the rating bars based on the fetched ratings data
    setFiveStarRatings(rating.filter((r) => r.rating_value === 5).length);
    setFourStarRatings(rating.filter((r) => r.rating_value === 4).length);
    setThreeStarRatings(rating.filter((r) => r.rating_value === 3).length);
    setTwoStarRatings(rating.filter((r) => r.rating_value === 2).length);
    setOneStarRatings(rating.filter((r) => r.rating_value === 1).length);

    document.getElementById(
      "outer-five"
    ).style.gridTemplateColumns = `${fiveStarRatings}fr 1fr`;

    document.getElementById(
      "outer-four"
    ).style.gridTemplateColumns = `${fourStarRatings}fr 1fr`;

    document.getElementById(
      "outer-three"
    ).style.gridTemplateColumns = `${threeStarRatings}fr 1fr`;

    document.getElementById(
      "outer-two"
    ).style.gridTemplateColumns = `${twoStarRatings}fr 1fr`;

    document.getElementById(
      "outer-one"
    ).style.gridTemplateColumns = `${oneStarRatings}fr 1fr`;
  }, [rating]);

  console.log(rating);

  //fetch the professor data from the database using the course id
  useEffect(() => {
    const fetchProfessorData = async () => {
      // Fetch course_professors
      const { data } = await supabase
        .from("course_professors")
        .select("*")
        .eq("course_id", id);

      if (data) {
        // Get professor details for each professor_id in the course_professors data
        const professorDetails = await Promise.all(
          data.map(async (professor) => {
            const { data: professorData } = await supabase
              .from("professors")
              .select("*")
              .eq("id", professor.professor_id);
            return professorData ? professorData[0] : null;
          })
        );

        // Set the professor data (filter out any null results)
        setProfessor(professorDetails.filter((prof) => prof !== null));
      }
    };

    fetchProfessorData();
  }, [id]);

  //get total number of objects in the ratings array
  const getTotalRatings = (ratings) => {
    return ratings.length;
  };

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
    if (ratings === 0) {
      return 0;
    }

    const total = ratings.reduce((acc, curr) => acc + curr.difficulty, 0); //reduce function takes in an accumulator and a current value. The current value is added to the accumulator.
    return (total / ratings.length).toFixed(0);
  };

  //count the number of ratings for each rating value
  const countRatings = (ratings) => {
    return ratings.reduce((acc, curr) => {
      acc[curr.rating_value] = (acc[curr.rating_value] || 0) + 1; // if the rating value is not in the accumulator, add it to the accumulator and set it to 1. If it is in the accumulator, increment it by 1.
      return acc;
    }, {});
  };

  //format the date to a more readable format for users.
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }; //options for the date format
    return new Date(dateString).toLocaleDateString(undefined, options); //toLocaleDateString() returns a string with a language sensitive representation of the date portion of this date.
  };

  //sorts the comments by date, highest rating, or lowest rating by comparing the highest rating to the lowest rating.
  const sortReviews = (reviews, criterion) => {
    return reviews.sort((a, b) => {
      if (criterion === "lowest") {
        return a.rating_value - b.rating_value;
      } else if (criterion === "highest") {
        return b.rating_value - a.rating_value;
      } else if (criterion === "date") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else {
        return 0;
      }
    });
  };

  //handle the event when the user selects a sorting criterion
  const handleSort = (e) => {
    setSortCriterion(e.target.value);
    setSortRatings(sortReviews(rating, e.target.value));
  };

  return (
    <div>
      <Navbar />
      <div className="course-info">
        <div className="professor-list">
          <h3 className="professor-subtitle">
            Professors who teach this course:{" "}
          </h3>
          {professor.map((professor) => (
            <div className="professor-names" key={professor.id}>
              <Link to={`/professor/${professor.professor_id}`}>
                {professor.name}
              </Link>
            </div>
          ))}
          <div>
            <h1 className="difficulty-title"> Level of Difficulty:</h1>
            <h1 className="difficulty-number">
              {" "}
              {rating.length > 0 ? getAverageDifficulty(rating) : "N/A"}{" "}
            </h1>
          </div>
        </div>
        <div className="rating-container">
          <div className="average-rating">
            <h1>
              {getAverageRating(rating)} <span className="star">⭐</span>
            </h1>
            <p>Total of {getTotalRatings(rating)} ratings</p>
          </div>
          {course.map((course) => (
            <div key={course.id}>
              <div className="course-title">
                <h2>{course.title}</h2>
                <p>Course ID: {course.course}</p>
              </div>
              <Link to={`/rate/${course.id}`}>
                <button className="rate-button">Rate</button>
              </Link>
            </div>
          ))}
        </div>
        <div className="rating-breakdown">
          <span>5 ⭐</span>
          <div id="outer-five">
            <div></div>
            <div></div>
          </div>
          <span>{fiveStarRatings}</span>
          <span>4 ⭐</span>
          <div id="outer-four">
            <div></div>
            <div></div>
          </div>
          <span>{fourStarRatings}</span>
          <span>3 ⭐</span>
          <div id="outer-three">
            <div></div>
            <div></div>
          </div>
          <span>{threeStarRatings}</span>
          <span>2 ⭐</span>
          <div id="outer-two">
            <div></div>
            <div></div>
          </div>
          <span>{twoStarRatings}</span>
          <span>1 ⭐</span>
          <div id="outer-one">
            <div></div>
            <div></div>
          </div>
          <span>{oneStarRatings}</span>
        </div>
      </div>
      <div className="comments-container">
        <h2 className="comments-title">Comments:</h2>
        {rating.map((r) => (
          <div key={r.id}>
            <div>
              <CommentCard
                rate={r.rating_value}
                difficulty={r.difficulty}
                text={r.comment}
                date={r.created_at.slice(0, 10)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadCourse;
