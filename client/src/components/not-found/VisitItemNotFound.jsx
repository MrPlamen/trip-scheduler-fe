import styles from "./TripNotFound.module.css";
import { Link } from "react-router";

export default function VisitItemNotFound() {
  return (
    <div className={styles.notFoundWrapper}>
      <h1 className={styles.notFoundCode}>404</h1>
      <h2 className={styles.notFoundTitle}>Visit Point Not Found</h2>
      <p className={styles.notFoundMessage}>
        The visit item you're looking for doesn't exist or may have been removed.
      </p>

      <Link to="/trips" className={styles.notFoundButton}>
        Back to Trips
      </Link>
    </div>
  );
}
