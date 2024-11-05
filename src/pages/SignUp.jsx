import { useState, useEffect } from "react";
import { supabase } from "../client";
import "../styles/SignUp.css";
import Navbar from "../components/Navbar";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [university, setUniversity] = useState("");
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // If user is already logged in, redirect to main page
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserData(user?.id); // in case we may need the user ID

    if (user) {
      window.location.href = "/";
    }
  };

  const handleImageUpload = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        if (img.width === 400 && img.height === 400) {
          // Proceed with upload
          const fileName = `public/pfp-${file.name}-${Date.now()}.jpg`;
          const { data, error } = await supabase.storage
            .from("profile-pictures")
            .upload(fileName, file);

          if (error) reject(error);
          else resolve(data.path); // Return file path
        } else {
          reject(new Error("Profile image must be 400x400 pixels."));
        }
      };
      img.onerror = () => reject(new Error("Invalid image file."));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const imagePath = profileImage
        ? await handleImageUpload(profileImage)
        : null;

      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            display_name: username,
            university: university,
            profile_image_url: imagePath,
          },
        },
      });

      if (error) {
        console.error("Error signing up:", error.message);
        setError(error.message);
      } else {
        window.location.href = "/";
      }
    } catch (uploadError) {
      console.error("Image upload error:", uploadError.message);
      setError(uploadError.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <form onSubmit={handleSignUp}>
          <div>
            <h1 className="title-name">Sign Up</h1>
            <input
              id="name"
              className="input-border"
              type="text"
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <select
              id="university"
              className="input-border"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              required
            >
              <option value="">Select University</option>
              <option value="Florida Atlantic University">
                Florida Atlantic University
              </option>
            </select>
          </div>
          <div>
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
          <div>
            <input
              id="profileImage"
              className="file-input-border"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>{" "}
    </>
  );
}

export default SignUp;
