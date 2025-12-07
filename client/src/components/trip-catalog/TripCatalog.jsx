import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";  
import TripCatalogItem from "./trip-catalog-item/TripCatalogItem";
import { useTrips } from "../../api/tripApi";

export default function TripCatalog() {
    const { trips } = useTrips(); 
    const { email } = useContext(UserContext);  

    const userTrips = Array.isArray(trips) 
    ? trips.filter(trip => Array.isArray(trip.members) && trip.members.includes(email)) 
    : [];


    const sortedTrips = userTrips.sort((a, b) => {
        const startA = new Date(a.startDate);
        const startB = new Date(b.startDate);

        return startA - startB;
    });

    return (
        <section id="catalog-page">
            <h1>Trips you are a part of</h1>

            {sortedTrips.length > 0
                ? sortedTrips.map(trip => <TripCatalogItem key={trip._id} {...trip} />)
                : <h3 className="no-articles">You are not a member of any trips yet.</h3>
            }
        </section>
    );
}
