import { Link } from "react-router";
import { useLatestTrips } from "../../api/tripApi";
import useAuth from "../../hooks/useAuth";
import './Home.css';

export default function Home() {
    const { latestTrips } = useLatestTrips();
    const { email } = useAuth();

    const isValidArray = Array.isArray(latestTrips);

    return (
        <section id="welcome-world">
            <div className="welcome-message">
                <h2>Welcome to Trip Planner!</h2>
            </div>

            <div id="home-page">
                <h1>Latest Trips</h1>

                <div className="trip-slider">
                    {isValidArray &&
                        latestTrips.map(trip => (
                            <div className="trip" key={trip._id}>
                                <div className="trip-text">
                                    <h3>{trip.title}</h3>
                                    <br />
                                    <div className="data-buttons">
                                        {email && Array.isArray(trip.members) && trip.members.includes(email) && (
                                            <Link to={`/trips/${trip._id}/details`} className="btn details-btn">Details</Link>
                                        )}
                                    </div>
                                </div>
                                <div className="image-latest">
                                    <img src={trip.imageUrl} alt={trip.title} />
                                </div>
                            </div>
                        ))}
                </div>

                {isValidArray && latestTrips.length === 0 && (
                    <p className="no-articles">No trips yet</p>
                )}
                {!isValidArray && (
                    <p className="no-articles">Loading or error fetching trips...</p>
                )}
            </div>
        </section>
    );
}
