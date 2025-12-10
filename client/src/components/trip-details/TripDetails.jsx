import { Link, useNavigate, useParams } from 'react-router';
import { useState, useCallback, useEffect } from 'react';
import CommentsShow from '../comment-show/CommentsShow';
import CommentsCreate from '../comments-create/CommentsCreate';
import VisitItemsFetcher from '../visit-items/VisitItemsFetcher';
import { useDeleteTrip } from '../../api/tripApi';
import { useEditItem } from "../../api/visitItemApi";
import useAuth from '../../hooks/useAuth';
import { shortFormatDate } from "../../utils/dateUtil";
import tripLikesService from "../../services/likesService";
import NotFound from "../not-found/NotFound";
import "../../../public/styles/details.css";
import TripNotFound from '../not-found/TripNotFound';

export default function TripDetails() {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const { email, id: userId } = useAuth();
    const { deleteTrip } = useDeleteTrip();
    const { edit } = useEditItem(tripId);

    // Trip state + 404 handling
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Fetch trip manually with 404 check
    useEffect(() => {
        if (!tripId) return;

        setLoading(true);
        setNotFound(false);

        fetch(`http://localhost:8080/data/trips/${tripId}`)
            .then(async res => {
                if (res.status === 404) {
                    setNotFound(true);
                    return null;
                }
                if (!res.ok) throw new Error("Server error");
                return res.json();
            })
            .then(data => {
                if (data) setTrip(data);
            })
            .catch(() => {
                // Any 500 or network error should NOT break the page
                console.error("Trip fetch failed");
            })
            .finally(() => setLoading(false));
    }, [tripId]);

    // States
    const [comments, setComments] = useState([]);
    const [newVisitItem, setNewVisitItem] = useState({ title: '', description: '', imageUrl: '' });
    const [selectedVisitItem, setSelectedVisitItem] = useState(null);
    const [visitItemsReloadKey, setVisitItemsReloadKey] = useState(0);
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);

    const isOwner = email === trip?.ownerEmail;
    const isMember = Array.isArray(trip?.members) && trip.members.some(m => m.email === email);

    // Fetch likes
    useEffect(() => {
        if (!tripId || !email) return;
        const load = async () => {
            try {
                const fetchedLikes = await tripLikesService.getAll(tripId);
                setLikes(fetchedLikes);
                setIsLiked(fetchedLikes.some(like => like.email === email));
            } catch (err) {
                console.error("Failed to load likes:", err);
            }
        };
        load();
    }, [tripId, email]);

    const likeHandler = async () => {
        if (!userId) return;
        try {
            await tripLikesService.createTripLike(email, tripId, userId);
            setLikes(prev => [...prev, { email, tripId, userId }]);
            setIsLiked(true);
        } catch (err) {
            console.error("Error liking trip:", err);
        }
    };

    const unlikeHandler = async () => {
        try {
            await tripLikesService.delete(email, tripId);
            setLikes(prev => prev.filter(like => like.email !== email));
            setIsLiked(false);
        } catch (err) {
            console.error("Error unliking trip:", err);
        }
    };

    const tripDeleteClickHandler = useCallback(async () => {
        if (!confirm(`Are you sure you want to delete ${trip.title}?`)) return;
        await deleteTrip(tripId);
        navigate('/trips');
    }, [tripId, deleteTrip, navigate, trip?.title]);

    const commentCreateHandler = useCallback((newComment) => {
        setComments(prev => [newComment, ...prev]);
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewVisitItem(prev => ({ ...prev, [name]: value }));
    };

    const editVisitItemHandler = (visitItem) => {
        setSelectedVisitItem(visitItem);
        setNewVisitItem({
            title: visitItem.title,
            description: visitItem.description,
            imageUrl: visitItem.imageUrl
        });
    };

    const visitItemSubmitHandler = async (event) => {
        event.preventDefault();
        const members = trip.members;

        const visitItemData = {
            ...newVisitItem,
            tripId,
            members,
            _ownerId: userId,
            _createdOn: Date.now()
        };

        try {
            if (selectedVisitItem) {
                await edit(selectedVisitItem._id, visitItemData);
            } else {
                await fetch(`http://localhost:8080/visitItems?tripId=${tripId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(visitItemData)
                });
            }

            setNewVisitItem({ title: '', description: '', imageUrl: '' });
            setSelectedVisitItem(null);
            setVisitItemsReloadKey(prev => prev + 1);
        } catch (error) {
            console.error('Error saving visit item:', error);
        }
    };

    // Load comments
    useEffect(() => {
        if (!tripId) return;
        const run = async () => {
            try {
                const data = await fetch(`http://localhost:8080/comments/trip/${tripId}`);
                const json = await data.json();
                setComments(Array.isArray(json) ? json : []);
            } catch (err) {
                console.error("Failed to load comments:", err);
            }
        };
        run();
    }, [tripId]);

    // ------------- RENDER LOGIC -------------------

    if (loading) return <div>Loading...</div>;
    if (notFound) return <NotFound />;
    if (!trip) return <TripNotFound />;

    return (
        <>
            <section id="trip-details">
                <h1>Trip Details</h1>
                <div className="info-section">
                    <div className="trip-header">
                        <img className="trip-img" src={trip.imageUrl} alt={trip.title} />
                        <h1>{trip.title}</h1>
                        <span className="levels">
                            <b>{shortFormatDate(trip.startDate)} - {shortFormatDate(trip.endDate)}</b>
                            {` (${trip.duration} days)`}
                        </span>
                        <br />
                        <p className="type">{trip.category}</p>
                    </div>

                    <p className="text">{trip.summary}</p>

                    <div className="likes-section">
                        <p>{likes.length} likes</p>
                        {isMember && (
                            isLiked ? (
                                <button onClick={unlikeHandler} className="button">Unlike</button>
                            ) : (
                                <button onClick={likeHandler} className="button">Like</button>
                            )
                        )}
                    </div>

                    <CommentsShow comments={comments} />

                    {isOwner && (
                        <div className="buttons">
                            <button
                                onClick={() => navigate(`/trips/${tripId}/edit`)}
                                className="button edit-details-btn"
                            >
                                Edit
                            </button>
                            <button onClick={tripDeleteClickHandler} className="button">
                                Delete
                            </button>
                        </div>
                    )}

                    {Array.isArray(trip.members) && trip.members.length > 0 && (
                        <div className="members-box">
                            <h3>Trip Members ({trip.members.length})</h3>
                            <ul>
                                {trip.members.map(member => (
                                    <li key={member.id}>
                                        {member.username ? member.username : member.email}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {isMember && (
                        <CommentsCreate
                            tripId={tripId}
                            onCreate={commentCreateHandler}
                        />
                    )}
                </div>
            </section>

            <VisitItemsFetcher
                tripId={tripId}
                email={email}
                userId={userId}
                onEdit={editVisitItemHandler}
                reloadTrigger={visitItemsReloadKey}
            />

            {isMember && (
                <section id="create-visit-item">
                    <h2>{selectedVisitItem ? 'Edit visit item' : 'Create a visit point'}</h2>
                    <form onSubmit={visitItemSubmitHandler}>
                        <div>
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={newVisitItem.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={newVisitItem.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="imageUrl">Image URL:</label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                value={newVisitItem.imageUrl}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="button">
                            {selectedVisitItem ? 'Save changes' : 'Create visit point'}
                        </button>
                    </form>
                </section>
            )}
        </>
    );
}
