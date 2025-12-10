import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useEditTrip, useTrip } from "../../api/tripApi";
import { calculateDuration } from '../../utils/dateUtil';

export default function TripEdit() {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const { trip, loading, notFound } = useTrip(tripId);
    const { edit } = useEditTrip();

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        startDate: '',
        endDate: '',
        imageUrl: '',
        members: '',
        summary: '',
        duration: ''
    });

    useEffect(() => {
        if (trip) {
            setFormData({
                title: trip.title || '',
                category: trip.category || '',
                startDate: trip.startDate || '',
                endDate: trip.endDate || '',
                imageUrl: trip.imageUrl || '',
                members: trip.members?.map(m => m.email).join(', ') || '',
                summary: trip.summary || '',
                duration: calculateDuration(trip.startDate, trip.endDate) || ''
            });
        }
    }, [trip]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'startDate' || name === 'endDate') {
            const newStartDate = name === 'startDate' ? value : formData.startDate;
            const newEndDate = name === 'endDate' ? value : formData.endDate;
            const newDuration = calculateDuration(newStartDate, newEndDate);
            setFormData(prev => ({ ...prev, [name]: value, duration: newDuration }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const formAction = async (e) => {
        e.preventDefault();

        const membersEmails = formData.members
            ? formData.members.split(',').map(email => ({ email: email.trim() }))
            : [];

        const tripToEdit = {
            ...formData,
            members: membersEmails
        };

        await edit(tripId, tripToEdit);

        navigate(`/trips/${tripId}/details`);
    };

    if (loading) return <p>Loading...</p>;
    if (notFound) return <p>Trip not found</p>;

    return (
        <section id="edit-page" className="auth">
            <form id="edit" onSubmit={formAction}>
                <div className="container">
                    <h1>Edit trip</h1>

                    <label htmlFor="title">Trip title:</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required />

                    <label htmlFor="category">Category:</label>
                    <input type="text" id="category" name="category" value={formData.category} onChange={handleInputChange} required />

                    <label htmlFor="startDate">Start Date:</label>
                    <input type="date" className="calendar-picker" id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} required />

                    <label htmlFor="endDate">End Date:</label>
                    <input type="date" className="calendar-picker" id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange} required />

                    <label htmlFor="imageUrl">Image:</label>
                    <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} required />

                    <label htmlFor="members">Trip members:</label>
                    <input type="text" name="members" id="members" placeholder="Add members..." value={formData.members} onChange={handleInputChange} />

                    <label htmlFor="summary">Summary:</label>
                    <textarea name="summary" id="summary" value={formData.summary} onChange={handleInputChange} required></textarea>

                    <input className="btn submit" type="submit" value="Edit trip" />
                </div>
            </form>
        </section>
    );
}
