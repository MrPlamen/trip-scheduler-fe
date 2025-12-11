import { useState, useEffect, useContext } from "react";
import request from "../../utils/request";
import { UserContext } from "../../contexts/UserContext";
import "./Profile.css";

export default function ProfilePage() {
  const { id, userLogoutHandler } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await request.get("/users/me");
        setUsername(data.username);
        setEmail(data.email);
        setAvatarUrl(data.avatarUrl || "");
      } catch (err) {
        setMessage("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await request.post("/users/update-profile", {
        username,
        email,
        avatarUrl,
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err?.error || "Failed to update profile");
    }
  };

  return (
    <div className="profile-page">
      <h2>Update Profile</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={updateProfile} className="profile-form">
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Avatar URL
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
