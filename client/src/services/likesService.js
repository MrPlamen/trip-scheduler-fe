import request from "../utils/request";

const baseUrl = 'http://localhost:8080/trips';

export default {
    async getAll(tripId) {
        if (!tripId) throw new Error("Trip ID is required to fetch likes");
        return request.get(`${baseUrl}/${tripId}/likes`);
    },

    createTripLike(email, tripId, userId) {
        if (!email) throw new Error("Email is required to like a trip");
        if (!tripId) throw new Error("Trip ID is required to like a trip");
        if (!userId) throw new Error("User ID is required to like a trip");

        return request.post(`${baseUrl}/${tripId}/likes`, {
            email,
            userId
        });
    },

    async delete(email, tripId) {
        if (!email) throw new Error("Email is required to delete a like");
        if (!tripId) throw new Error("Trip ID is required to delete a like");

        await request.delete(`${baseUrl}/${tripId}/likes?email=${encodeURIComponent(email)}`);
    }
};
