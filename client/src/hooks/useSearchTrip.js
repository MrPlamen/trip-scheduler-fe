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
                
                const tripsWithMember = trips.filter(trip =>
                    trip.members && trip.members.includes(memberEmail)
                );
                
                setFilteredTrips(tripsWithMember);
            } catch (error) {
                setError("Failed to fetch trips.");
                console.error("Error fetching trips:", error);
            }
        };

        if (memberEmail) {
            fetchTripsByMember();
        }
    }, [memberEmail]); 

    return { filteredTrips, error };
};
