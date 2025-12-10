import styles from "./TripNotFound.module.css";
import { Link } from "react-router";

export default function TripNotFound() {
  return (
    <div className={styles.notFoundWrapper}>
      <h1 className={styles.notFoundCode}>404</h1>
      <h2 className={styles.notFoundTitle}>Trip Not Found</h2>
      <p className={styles.notFoundMessage}>
        The trip you're looking for doesn't exist or may have been removed.
      </p>

      <Link to="/trips" className={styles.notFoundButton}>
        Back to Trips
      </Link>
    </div>
  );
}
