import { useEffect, useState, useCallback } from 'react';
import VisitItems from './VisitItems';
import request from '../../utils/request';

export default function VisitItemsFetcher({ tripId, email, userId, onLike, onEdit, onAddComment, reloadTrigger }) {
    const [visitItems, setVisitItems] = useState([]);

    const fetchVisitItems = useCallback(async () => {
        if (!tripId) return; // avoid fetching if tripId is missing

        try {
            const response = await request.get(`http://localhost:8080/trips/${tripId}/visit-items`);
            
            if (response) {
                // Ensure response is an array
                const itemsArray = Array.isArray(response) ? response : Object.values(response);
                setVisitItems(itemsArray);
            } else {
                setVisitItems([]);
            }
        } catch (error) {
            console.error('Error fetching visit items:', error);
        }
    }, [tripId]);

    useEffect(() => {
        fetchVisitItems();
    }, [fetchVisitItems, reloadTrigger]); 

    return (
        <VisitItems
            visitItems={visitItems}
            email={email}
            userId={userId}
            onLike={onLike}
            onEdit={onEdit}
            onAddComment={onAddComment}
        />
    );
}
