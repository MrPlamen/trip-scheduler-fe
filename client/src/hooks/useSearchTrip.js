import { useEffect, useState } from "react";
import request from "../utils/request";

const baseUrl = `http://localhost:8080/data/trips`;

export const useSearchTrip = (memberEmail) => {
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTripsByMember = async () => {
            try {
                const trips = await request.get(baseUrl);
                
                const tripsWithMember = trips.filter(
                    trip =>
                        Array.isArray(trip.members) &&
                        trip.members.some(
                            member => member.email === memberEmail.trim()
                        )
                );
                
                setFilteredTrips(tripsWithMember);
            } catch (error) {
                setError("Failed to fetch trips.");
                console.error("Error fetching trips:", error);
            }
        };

        if (memberEmail.trim()) {
            fetchTripsByMember();
        } else {
            setFilteredTrips([]); 
        }
    }, [memberEmail]);

    return { filteredTrips, error };
};
