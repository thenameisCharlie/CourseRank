import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/SignIn.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // If user is already logged in, redirect to main page
    fetchUserData();
  });

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserData(user.id);

    if (userData) {
      window.location.href = "/";
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      setError(error.message);
    } else {
      window.location.href = "/";
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="signin-container">
        <form onSubmit={handleSignIn}>
          <div>
            <h1 className="title-name">Sign in</h1>
            <input
              id="email"
              className="input-border"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              id="password"
              className="input-border"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="button-border" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <Link to="/signup">
            <button type="submit">Sign up</button>
          </Link>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
}

export default SignIn;
