import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const baseUrl = `http://localhost:8080/data/trips`;

// ------------------- Fetch all trips -------------------
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

// ------------------- Fetch single trip -------------------
export const useTrip = (tripId) => {
    const { request } = useAuth();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!tripId) return;
        setLoading(true);
        request.get(`${baseUrl}/${tripId}`)
            .then(data => setTrip(data))
            .catch(err => {
                if (err.status === 404) setNotFound(true);
                else console.error("Error fetching trip:", err);
            })
            .finally(() => setLoading(false));
    }, [tripId, request]);

    return { trip, loading, notFound };
};

// ------------------- Fetch latest trips -------------------
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

                const response = await request.get("http://localhost:8080/data/trips/public");
                setLatestTrips(response);
            } catch (err) {
                setError("Failed to fetch latest trips.");
                console.error("Error fetching latest trips:", err);
            }
        };
        fetchLatestTrips();
    }, [request]);

    return { latestTrips, error };
};

// ------------------- Create a trip -------------------
export const useCreateTrip = () => {
    const { request } = useAuth();

    const create = async (tripData) => {
        try {
            const uniqueEmails = [
                ...new Set(
                    (tripData.members || [])
                        .map(email => email.trim())
                        .filter(Boolean)
                )
            ];

            const payload = {
                ...tripData,
                members: uniqueEmails.map(email => ({ email }))
            };

            return await request.post(baseUrl, payload, {
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            console.error("Error creating trip:", error);
            throw error;
        }
    };

    return { create };
};

// ------------------- Edit a trip -------------------
export const useEditTrip = () => {
    const { request } = useAuth();

    const edit = async (tripId, tripData) => {
        try {
            const emails = [
                ...new Set(
                    (tripData.members || [])
                        .map(member =>
                            typeof member === "string"
                                ? member.trim()
                                : member?.email?.trim()
                        )
                        .filter(Boolean)
                )
            ];

            const payload = {
                ...tripData,
                _id: tripId,
                members: emails.map(email => ({ email }))
            };

            return await request.put(`${baseUrl}/${tripId}`, payload, {
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            console.error("Error editing trip:", error);
            throw error;
        }
    };

    return { edit };
};


// ------------------- Delete a trip -------------------
export const useDeleteTrip = () => {
    const { request } = useAuth();

    const deleteTrip = async (tripId) => {
        try {
            return await request.delete(`${baseUrl}/${tripId}`);
        } catch (error) {
            console.error("Error deleting trip:", error);
            throw error;
        }
    };

    return { deleteTrip };
};
