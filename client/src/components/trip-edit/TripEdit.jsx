import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useEditTrip, useTrip } from "../../api/tripApi";
import { calculateDuration } from '../../utils/dateUtil';

export default function TripEdit() {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const { trip, loading, error } = useTrip(tripId);  // Assuming you have loading and error states from useTrip hook
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

    // Populate form data with existing trip info when the trip is loaded
    useEffect(() => {
        if (trip) {
            setFormData({
                title: trip.title || '',
                category: trip.category || '',
                startDate: trip.startDate || '',
                endDate: trip.endDate || '',
                imageUrl: trip.imageUrl || '',
                members: trip.members?.join(', ') || '',  // Assuming members is an array
                summary: trip.summary || '',
                duration: calculateDuration(trip.startDate, trip.endDate) || ''
            });
        }
    }, [trip]);

    // Handle form data input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Calculate duration when either start or end date changes
        if (name === 'startDate' || name === 'endDate') {
            const newStartDate = name === 'startDate' ? value : formData.startDate;
            const newEndDate = name === 'endDate' ? value : formData.endDate;
            const newDuration = calculateDuration(newStartDate, newEndDate);
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                duration: newDuration
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    // Form submission action
    const formAction = async (e) => {
        e.preventDefault();

        // Prepare trip data to send
        const { members, ...tripData } = formData;
        const membersEmails = members ? members.split(', ').map(email => email.trim()) : [];

        const tripToEdit = {
            ...tripData,
            members: membersEmails,
        };

        await edit(tripId, tripToEdit);

        // Navigate to trip details after editing
        navigate(`/trips/${tripId}/details`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading trip: {error.message}</p>;
    }

    return (
        <section id="edit-page" className="auth">
            <form id="edit" onSubmit={formAction}>
                <div className="container">
                    <h1>Edit trip</h1>

                    <label htmlFor="title">Trip title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        className="calendar-picker"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        className="calendar-picker"
                        id="endDate"
                        name="endDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="imageUrl">Image:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="members">Trip members:</label>
                    <input
                        type="text"
                        name="members"
                        id="members"
                        placeholder="Add members..."
                        value={formData.members}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="summary">Summary:</label>
                    <textarea
                        name="summary"
                        id="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        required
                    ></textarea>

                    <input className="btn submit" type="submit" value="Edit trip" />
                </div>
            </form>
        </section>
    );
}
