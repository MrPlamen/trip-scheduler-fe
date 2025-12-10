import { useNavigate } from "react-router";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you’re looking for doesn’t exist.</p>
      <button className="home-button" onClick={() => navigate("/")}>
        Go back to home
      </button>
    </div>
  );
}
