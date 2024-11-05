import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../client";
import "../styles/Navbar.css";

const Navbar = () => {
  const [userData, setUserData] = useState(null);

  const handleSignout = async () => {
    await supabase.auth.signOut();
    setUserData(null);
  };

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
  }, []);

  return (
    <div className="navbar">
      <nav className="navbar-brand">
        <ul>
          <li>
            <Link to="/">
              <button className="headerBtn">Home</button>
            </Link>
          </li>
          <li>
            <Link to="/rank-course">
              <button className="headerBtn">Rank Course</button>
            </Link>
          </li>
          <li>
            <Link to="/rank-professor">
              <button className="headerBtn">Rank Professor</button>
            </Link>
          </li>
          {userData ? (
            <>
              <Link to="/">
                <button className="headerBtn signout" onClick={handleSignout}>
                  {userData.user_metadata.display_name}
                </button>
              </Link>
              <li>
                <Link to="/">
                  <div className="profile-container">
                    <img
                      src={`https://thfdcazcceydntzmyaip.supabase.co/storage/v1/object/public/profile-pictures/${userData.user_metadata.profile_image_url}`}
                      alt="Profile"
                      className="profile-picture"
                      width={65}
                      height={65}
                    />
                  </div>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signin">
                  <button className="headerBtn">Log In</button>
                </Link>
              </li>
              <li>
                <Link to="/signup">
                  <button className="headerBtn signup">Sign Up</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
