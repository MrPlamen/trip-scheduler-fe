import { Link, useNavigate, useParams } from 'react-router';
import { useState, useCallback } from 'react';
import CommentsShow from '../comment-show/CommentsShow';
import CommentsCreate from '../comments-create/CommentsCreate';
import VisitItemsFetcher from '../visit-items/VisitItemsFetcher';
import { useDeleteTrip, useTrip } from '../../api/tripApi';
import { useEditItem } from "../../api/visitItemApi";
import useAuth from '../../hooks/useAuth';
import { shortFormatDate } from "../../utils/dateUtil";
import "../../../public/styles/details.css";

export default function TripDetails() {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const { trip } = useTrip(tripId);
    const { email, _id: userId } = useAuth();
    const { deleteTrip } = useDeleteTrip();
    const { edit } = useEditItem(tripId); // pass tripId here

    const [comments, setComments] = useState([]);
    const [newVisitItem, setNewVisitItem] = useState({ title: '', description: '', imageUrl: '' });
    const [selectedVisitItem, setSelectedVisitItem] = useState(null);
    const [visitItemsReloadKey, setVisitItemsReloadKey] = useState(0);

    const tripDeleteClickHandler = useCallback(async () => {
        if (!confirm(`Are you sure you want to delete ${trip.title}?`)) return;
        await deleteTrip(tripId);
        navigate('/trips');
    }, [tripId, deleteTrip, navigate, trip?.title]);

    const commentCreateHandler = useCallback((newComment) => {
        setComments(prev => [...prev, newComment]);
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
                // Use proper template string
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

    const isOwner = userId === trip?._ownerId;
    const isMember = Array.isArray(trip?.members) && trip.members.includes(email);

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
                                {trip.members.map((memberEmail, index) => (
                                    <li key={index}>{memberEmail}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <CommentsCreate
                    email={email}
                    tripId={tripId}
                    onCreate={commentCreateHandler}
                />
            </section>

            {/* Visit Items Section */}
            <VisitItemsFetcher
                tripId={tripId}
                email={email}
                userId={userId}
                onEdit={editVisitItemHandler}
                reloadTrigger={visitItemsReloadKey}
            />

            {/* Create/Edit Visit Item Section */}
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
