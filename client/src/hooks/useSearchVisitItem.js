import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

// Hook to fetch visit items for a given trip filtered by member email
export const useSearchVisitItem = (tripId, memberEmail) => {
    const { request } = useAuth();
    const [filteredItems, setFilteredItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tripId || !memberEmail) return; // only fetch if both are available

        const fetchItemsByMember = async () => {
            try {
                const url = `http://localhost:8080/trips/${tripId}/visit-items`;
                const items = await request.get(url);

                // Ensure we have an array
                const itemsArray = Array.isArray(items) ? items : Object.values(items);

                // Filter items where memberEmail is included in members
                const itemsWithMember = itemsArray.filter(item =>
                    item.members && item.members.includes(memberEmail)
                );

                setFilteredItems(itemsWithMember);
            } catch (err) {
                setError("Failed to fetch items.");
                console.error("Error fetching items:", err);
            }
        };

        fetchItemsByMember();
    }, [tripId, memberEmail, request]);

    return { filteredItems, error };
};
