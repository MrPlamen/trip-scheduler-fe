import { useCallback, useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import request from '../../utils/request';
import itemLikesService from '../../services/itemLikesService';
import { useDeleteItem } from '../../api/visitItemApi';
import './VisitItems.css';

export default function VisitItems({ visitItems, email, userId, onEdit }) {
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [visitItemId, setVisitItemId] = useState([]);
    const [likedItems, setLikedItems] = useState({});
    const navigate = useNavigate();
    const { deleteItem } = useDeleteItem();

    useEffect(() => {
        if (!visitItems) return;

        const visitItemIds = Object.values(visitItems).map((item) => item._id);
        setVisitItemId(visitItemIds);

        const fetchLikes = async () => {
            try {
                const fetchedLikes = await request.get('http://localhost:8080/jsonstore/itemLikes');
                setLikes(Object.values(fetchedLikes));
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        };

        fetchLikes();
    }, [visitItems, likedItems, isLiked]);

    const getLikeCount = useMemo(() => {
        return (visitItemId) => {
            return likes.filter(like => like.visitItemId === visitItemId).length;
        };
    }, [likes]);

    const likeHandler = async (visitItemId) => {
        try {
            const newLike = { email, visitItemId, like: true, userId };

            await itemLikesService.createItemLike(email, visitItemId, true, userId);

            setLikes((prevLikes) => [...prevLikes, newLike]);

            setLikedItems((prevLikedItems) => ({
                ...prevLikedItems,
                [visitItemId]: true,
            }));

            setIsLiked(true);
        } catch (error) {
            console.error('Error liking the item:', error);
        }
    };

    const unlikeHandler = async (visitItemId) => {
        try {
            await itemLikesService.delete(email, visitItemId);

            setLikes((prevLikes) => prevLikes.filter(like => like.email !== email || like.visitItemId !== visitItemId));

            setLikedItems((prevLikedItems) => ({
                ...prevLikedItems,
                [visitItemId]: false,
            }));

            setIsLiked(false);
        } catch (error) {
            console.error('Error unliking the item:', error);
        }
    };

    const itemDeleteClickHandler = useCallback(async (visitItemId) => {
        const hasConfirm = confirm(`Are you sure you want to delete this place for visit?`);
        if (!hasConfirm) return;

        await deleteItem(visitItemId);
        navigate(0);
    }, [deleteItem, navigate]);

    return (
        <>
            <h2>Visit points</h2>
            <div id="visit-items">
                {visitItems && Object.values(visitItems).length > 0 ? (
                    Object.values(visitItems).map((item) => {
                        if (!item) return null;

                        const userLikeForItem = likes.find(like => like.email === email && like.visitItemId === item._id);
                        const isOwner = userId === item?._ownerId;

                        return (
                            <div key={item._id} className="visit-item-card">
                                <img src={item.imageUrl} alt={item.title} />
                                <h3>{item.title}</h3>
                                <p><Link to={`/visits/${item._id}/details`} className="visit-item-card-link">Details</Link></p>
                                <p>{item.description}</p>
                                <span>Likes: {getLikeCount(item._id)}</span>
                                <div className="likes-section">
                                    {userLikeForItem ? (
                                        <button onClick={() => unlikeHandler(item._id)} className="button">Unlike</button>
                                    ) : (
                                        <button onClick={() => likeHandler(item._id)} className="button">Like</button>
                                    )}

                                    {isOwner && (
                                        <div className="buttons">
                                            <button onClick={() => onEdit(item)} className="button edt-btn edit-details-btn">Edit</button>
                                            <button onClick={() => itemDeleteClickHandler(item._id)} className="button">Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No visit items for this trip yet.</p>
                )}
            </div>
        </>
    );
}
