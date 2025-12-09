import { useEffect, useState, useCallback } from 'react';
import VisitItems from './VisitItems';
import request from '../../utils/request';

export default function VisitItemsFetcher({ tripId, email, userId, onLike, onEdit, onAddComment, reloadTrigger }) {
    const [visitItems, setVisitItems] = useState([]);

    const fetchVisitItems = useCallback(async () => {
        if (!tripId) return; 

        try {
            const response = await request.get(`http://localhost:8080/trips/${tripId}/visit-items`);
            
            if (response) {
                const itemsArray = Array.isArray(response) ? response : Object.values(response);

                // Ensure members is an array of MemberResponse objects
                const normalizedItems = itemsArray.map(item => ({
                    ...item,
                    members: Array.isArray(item.members) ? item.members : [],
                }));

                setVisitItems(normalizedItems);
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
