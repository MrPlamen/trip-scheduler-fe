import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

export const useSearchVisitItem = (memberEmail) => {
    const { request } = useAuth();
    const [filteredItems, setFilteredItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!memberEmail?.trim()) {
            setFilteredItems([]); 
            return;
        }

        const fetchItemsByMember = async () => {
            try {
                const url = `http://localhost:8080/visit-items`;
                const items = await request.get(url);

                const itemsArray = Array.isArray(items) ? items : Object.values(items);

                const itemsWithMember = itemsArray.filter(item =>
                    Array.isArray(item.members) &&
                    item.members.some(member => member.email === memberEmail.trim())
                );

                setFilteredItems(itemsWithMember);
            } catch (err) {
                setError("Failed to fetch visit points.");
                console.error("Error fetching visit items:", err);
            }
        };

        fetchItemsByMember();
    }, [memberEmail, request]);

    return { filteredItems, error };
};
