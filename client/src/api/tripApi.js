import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth"; 

const baseUrl = `http://localhost:8080/data/trips`;

export const useTrips = () => {
    const { request } = useAuth(); 
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        request.get(baseUrl)
            .then(setTrips)
            .catch(error => console.error("Error fetching trips:", error)); 
    }, [request]);

    return { trips };
};

export const useTrip = (tripId) => {
    const { request } = useAuth(); 
    const [trip, setTrip] = useState({});

    useEffect(() => {
        request.get(`${baseUrl}/${tripId}`)
            .then(setTrip)
            .catch(error => console.error("Error fetching trip:", error)); 
    }, [tripId, request]);

    return { trip };
};

export const useLatestTrips = () => {
    const { request } = useAuth(); 
    const [latestTrips, setLatestTrips] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestTrips = async () => {
            try {
                const searchParams = new URLSearchParams({
                    sortBy: '_createdOn desc',
                    pageSize: 3,
                    select: '_id,imageUrl,title,members',
                });

                const response = await request.get(`${baseUrl}?${searchParams.toString()}`);
                setLatestTrips(response);
            } catch (error) {
                setError("Failed to fetch latest trips.");
                console.error("Error fetching latest trips:", error);
            }
        };

        fetchLatestTrips();
    }, [request]);

    return { latestTrips, error };
};

export const useCreateTrip = () => {
    const { request } = useAuth();

    const create = (tripData) =>
        request.post(baseUrl, tripData)
            .catch(error => console.error("Error creating trip:", error)); 

    return { create };
};

export const useEditTrip = () => {
    const { request } = useAuth(); 

    const edit = (tripId, tripData) =>
        request.put(`${baseUrl}/${tripId}`, { ...tripData, _id: tripId })
            .catch(error => console.error("Error editing trip:", error)); 

    return { edit };
};

export const useDeleteTrip = () => {
    const { request } = useAuth(); 

    const deleteTrip = (tripId) =>
        request.delete(`${baseUrl}/${tripId}`)
            .catch(error => console.error("Error deleting trip:", error)); 

    return { deleteTrip };
};
