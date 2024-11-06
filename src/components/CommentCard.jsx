import React from "react";
import PropTypes from "prop-types";
import "../styles/CommentCard.css";

const CommentCard = ({ rate, difficulty, text, date }) => {
  return (
    <div className="comment-card">
      <div className="rate-header">
        <div className="comment-rate">Rating: {rate}</div>
        <div className="comment-difficulty">Difficulty: {difficulty}</div>
      </div>
      <div className="comment-header">
        <div className="comment-text">{text}</div>
        <div className="comment-date">{date}</div>
      </div>
    </div>
  );
};

CommentCard.propTypes = {
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default CommentCard;
