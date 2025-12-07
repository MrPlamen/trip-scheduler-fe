import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

// Hook to fetch all visit items for a given trip
export const useVisitItems = (tripId) => {
    const { request } = useAuth(); 
    const [visitItems, setVisitItems] = useState([]);

    useEffect(() => {
        if (!tripId) return;

        const url = `http://localhost:8080/trips/${tripId}/visit-items`;
        request.get(url)
            .then(setVisitItems)
            .catch(err => console.error("Error fetching visit items:", err));
    }, [tripId, request]);

    return { visitItems };
};

// Hook to edit a visit item
export const useEditItem = (tripId) => {
    const { request } = useAuth();

    const edit = (visitItemId, visitItemData) => {
        const url = `http://localhost:8080/trips/${tripId}/visit-items/${visitItemId}`;
        return request.put(url, visitItemData);
    };

    return { edit };
};

// Hook to delete a visit item
export const useDeleteItem = (tripId) => {
    const { request } = useAuth();

    const deleteItem = (visitItemId) => {
        const url = `http://localhost:8080/trips/${tripId}/visit-items/${visitItemId}`;
        return request.delete(url);
    };

    return { deleteItem };
};

// Hook to fetch a single visit item by its ID
export const useVisitItem = (tripId, visitItemId) => {
    const { request } = useAuth(); 
    const [visitItem, setVisitItem] = useState({});

    useEffect(() => {
        if (!tripId || !visitItemId) return;

        const url = `http://localhost:8080/trips/${tripId}/visit-items/${visitItemId}`;

        request.get(url)
            .then(setVisitItem)
            .catch(err => console.error("Error fetching visit item:", err));
    }, [tripId, visitItemId, request]);

    return {
        visitItem,
        refetchVisitItem: () => {
            if (!tripId || !visitItemId) return;
            return request.get(`http://localhost:8080/trips/${tripId}/visit-items/${visitItemId}`)
                .then(setVisitItem)
                .catch(err => console.error("Error fetching visit item:", err));
        }
    };
};
