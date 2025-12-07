import { useNavigate } from 'react-router';
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useCreateTrip } from '../../api/tripApi';
import { calculateDuration } from '../../utils/dateUtil';

export default function TripCreate() {
    const navigate = useNavigate();
    const { create: createTrip } = useCreateTrip();
    const { email } = useContext(UserContext);
    const [members, setMembers] = useState("");
    const [membersArray, setMembersArray] = useState([]);

    const submitAction = async (formData) => {

        const tripData = Object.fromEntries(formData);

        let membersEmails = [];

        if (tripData.members) {
            membersEmails = tripData.members.split(', ').map(email => email.trim());
        }

        tripData.members = [email, ...membersEmails];

        tripData.owner = email;
        const duration = calculateDuration(tripData.startDate, tripData.endDate);
        tripData.duration = duration;

        await createTrip(tripData);

        navigate('/trips');
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setMembers(value);

        // Process the input: split by commas, trim spaces, and filter empty values
        const emails = value
            .split(",")
            .map(email => email.trim()) // Trim spaces around each email
            .filter(email => email !== ""); // Remove empty strings

        setMembersArray(emails); // Save the processed list of emails
    };

    return (
        <section id="create-page" className="auth">
            <form id="create" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                submitAction(formData);
            }}>
                <div className="container">

                    <h1>Create a Trip</h1>
                    <label htmlFor="title">Trip title:</label>
                    <input type="text" id="title" name="title" placeholder="Enter trip title..." required />

                    <label htmlFor="category">Category:</label>
                    <input type="text" id="category" name="category" placeholder="Enter trip category..." required />

                    <label htmlFor="startDate">Start Date:</label>
                    <input type="date" className="calendar-picker" id="startDate" name="startDate" required />

                    <label htmlFor="endDate">End Date:</label>
                    <input type="date" className="calendar-picker" id="endDate" name="endDate" required />

                    <label htmlFor="imageUrl">Image:</label>
                    <input type="text" id="imageUrl" name="imageUrl" placeholder="Upload a photo..." required />

                    <label htmlFor="members">Trip members <span className="field-info">(comma-separated)</span>:</label>
                    <input
                        type="text"
                        name="members"
                        id="members"
                        placeholder="member1@mail.com, member2@mail.com..."
                        value={members}
                        onChange={handleChange}
                    />
                    <div>
                        <h3 className='members-list-head'>Members list:</h3>
                        <ul>
                            {membersArray.map((email, index) => (
                                <li key={index}>{email}</li>
                            ))}
                        </ul>
                    </div>

                    <label htmlFor="summary">Summary:</label>
                    <textarea name="summary" id="summary" required></textarea>

                    <input className="btn submit" type="submit" value="Create" />
                </div>
            </form>
        </section>
    );
}
