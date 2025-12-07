import { useState } from "react";
import { useSearchTrip } from "../../hooks/useSearchTrip";
import { useSearchVisitItem } from "../../hooks/useSearchVisitItem";
import { Link } from "react-router";
import './Search.css';  

const Search = () => {
    const [memberEmail, setMemberEmail] = useState("");  
    const { filteredTrips, error } = useSearchTrip(memberEmail);
    const { filteredItems, errorItem } = useSearchVisitItem(memberEmail);

    return (
        <div className="search-container">
            <h2 className="search-title">Search trips by member</h2>

            <div className="search-input-container">
                <label htmlFor="search-email" className="search-label"></label>
                <input
                    type="text"
                    id="search-email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="Enter email of the member"
                    className="search-input"
                />
            </div>

            {error && <p className="error-message">{error}</p>}
            {errorItem && <p className="error-message">{errorItem}</p>}

            { filteredTrips.length > 0 && (<div className="search-results-container">
                <div className="search-results search-trips">
                    <h3>Trips</h3>
                    <ul className="search-list">
                        {filteredTrips.length > 0 ? (
                            filteredTrips.map((trip) => {
                                const isMember = Array.isArray(trip.members) && trip.members.includes(memberEmail.trim());
                                const content = (
                                  <>
                                    <img src={trip.imageUrl} alt={trip.title} className="search-item-image" />
                                    <p className="search-item-title">{trip.title}</p>
                                  </>
                                );
                              
                                return (
                                  <li key={trip._id} className="search-item">
                                    {isMember ? (
                                      <Link to={`/trips/${trip._id}/details`} className="search-link">{content}</Link>
                                    ) : content}
                                  </li>
                                );
                              })
                        ) : (
                            <p>No trips found for this member.</p>
                        )}
                    </ul>
                </div>

                <div className="search-results search-visit-points">
                    <h3>Visit Points</h3>
                    <ul className="search-list">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => {
                                const isMember = Array.isArray(item.members) && item.members.includes(memberEmail.trim());
                                const content = (
                                  <>
                                    <img src={item.imageUrl} alt={item.title} className="search-item-image" />
                                    <p className="search-item-title">{item.title}</p>
                                  </>
                                );
                              
                                return (
                                  <li key={item._id} className="search-item">
                                    {isMember ? (
                                      <Link to={`/visits/${item._id}/details`} className="search-link">{content}</Link>
                                    ) : content}
                                  </li>
                                );
                              })
                        ) : (
                            <p className="no-items-result">No visit points found for this member.</p>
                        )}
                    </ul>
                </div>
            </div>)}
        </div>
    );
};

export default Search;
