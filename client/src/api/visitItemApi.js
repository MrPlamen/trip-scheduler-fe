import { useEffect, useState, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import commentService from "../services/commentService";
import itemLikesService from "../services/itemLikesService";

// ------------------ Fetch all visit items for a trip ------------------
export const useVisitItems = (tripId) => {
    const { request } = useAuth();
    const [visitItems, setVisitItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                let url;

                if (tripId) {
                    url = `http://localhost:8080/trips/${tripId}/visit-items`;
                } else {
                    url = `http://localhost:8080/visit-items`;
                }

                const data = await request.get(url);
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
            return await request.put(
                `http://localhost:8080/visit-items/${visitItemId}`,
                visitItemData,
                {
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'  // if using session/cookie auth
                }
            );
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

// ------------------ Likes and comments (works for trips or visit items) ------------------
export const useItemInteractions = (parentId, userId) => {
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [isLiked, setIsLiked] = useState(false);

    const fetchInteractions = useCallback(async () => {
        if (!parentId) return;

        try {
            // Likes (only meaningful for visit items)
            let fetchedLikes = await itemLikesService.getAll(parentId);
            fetchedLikes = Array.isArray(fetchedLikes) ? fetchedLikes : [];
            setLikes(fetchedLikes);
            setIsLiked(fetchedLikes.some(like => like.userId === userId));

            // Comments (works for both trips and visit items)
            let fetchedComments = await commentService.getAll(parentId);
            fetchedComments = Array.isArray(fetchedComments) ? fetchedComments : [];
            setComments(fetchedComments);

        } catch (err) {
            console.error("Error fetching likes/comments:", err);
        }
    }, [parentId, userId]);

    useEffect(() => {
        fetchInteractions();
    }, [fetchInteractions]);

    return { likes, comments, isLiked, refetchInteractions: fetchInteractions };
};
