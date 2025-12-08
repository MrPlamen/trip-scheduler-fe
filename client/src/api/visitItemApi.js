// visitItemApi.js
import { useEffect, useState, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import commentService from "../services/commentService";
import itemLikesService from "../services/itemLikesService";

// ------------------ Fetch all visit items for a trip ------------------
export const useVisitItems = (tripId) => {
    const { request } = useAuth();
    const [visitItems, setVisitItems] = useState([]);

    useEffect(() => {
        if (!tripId) return;

        const fetchItems = async () => {
            try {
                const data = await request.get(`http://localhost:8080/trips/${tripId}/visit-items`);
                setVisitItems(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching visit items:", err);
            }
        };

        fetchItems();
    }, [tripId, request]);

    return { visitItems };
};

// ------------------ Fetch a single visit item ------------------
export const useVisitItem = (visitItemId) => {
    const { request } = useAuth();
    const [visitItem, setVisitItem] = useState(null);

    const fetchItem = useCallback(async () => {
        if (!visitItemId) return;

        try {
            const data = await request.get(`http://localhost:8080/visit-items/${visitItemId}`);
            setVisitItem(data || null);
        } catch (err) {
            console.error("Error fetching visit item:", err);
        }
    }, [visitItemId, request]);

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    return { visitItem, refetchVisitItem: fetchItem };
};

// ------------------ Edit a visit item ------------------
export const useEditItem = () => {
    const { request } = useAuth();

    const edit = useCallback(async (visitItemId, visitItemData) => {
        if (!visitItemId) return;
        try {
            return await request.put(`http://localhost:8080/visit-items/${visitItemId}`, visitItemData);
        } catch (err) {
            console.error("Error editing visit item:", err);
            throw err;
        }
    }, [request]);

    return { edit };
};

// ------------------ Delete a visit item ------------------
export const useDeleteItem = () => {
    const { request } = useAuth();

    const deleteItem = useCallback(async (visitItemId) => {
        if (!visitItemId) return;
        try {
            return await request.delete(`http://localhost:8080/visit-items/${visitItemId}`);
        } catch (err) {
            console.error("Error deleting visit item:", err);
            throw err;
        }
    }, [request]);

    return { deleteItem };
};

// ------------------ Likes and comments ------------------
export const useItemInteractions = (visitItemId, userId) => {
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [isLiked, setIsLiked] = useState(false);

    const fetchInteractions = useCallback(async () => {
        if (!visitItemId) return;

        try {
            // Likes
            let fetchedLikes = await itemLikesService.getAll(visitItemId);
            fetchedLikes = Array.isArray(fetchedLikes) ? fetchedLikes : [];
            setLikes(fetchedLikes);
            setIsLiked(fetchedLikes.some(like => like.userId === userId));

            // Comments
            let fetchedComments = await commentService.getAll(visitItemId);
            fetchedComments = Array.isArray(fetchedComments) ? fetchedComments : [];
            setComments(fetchedComments);
        } catch (err) {
            console.error("Error fetching likes/comments:", err);
        }
    }, [visitItemId, userId]);

    useEffect(() => {
        fetchInteractions();
    }, [fetchInteractions]);

    return { likes, comments, isLiked, refetchInteractions: fetchInteractions };
};
