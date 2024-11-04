import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../client";

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
      } else if (user) setUserData(user);
    };

    fetchUser();
  }, []);

  return (
    <div className="navbar">
      <nav className="navbar-brand">
        <ul>
          <li>
            <Link to="/">
              {" "}
              <button className="headerBtn">Home</button>
            </Link>
          </li>
          <li>
            {userData ? (
              <>
                <Link to="/">
                  <button className="headerBtn">
                    {userData.user_metadata.display_name}
                  </button>
                </Link>
                <li>
                  <Link to="/">
                    <button className="headerBtn" onClick={handleSignout}>
                      Sign Out
                    </button>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <button className="headerBtn"> Sign In </button>
                </Link>
              </>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
