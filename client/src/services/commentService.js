import request from "../utils/request";

const baseUrl = 'http://localhost:8080/comments';

export default {
    async getAll(tripId) {
        const comments = await request.get(baseUrl);

        const tripComments = Object.values(comments).filter(comment => comment.tripId === tripId);

        return tripComments;
    },
    create(username, email, tripId, comment) {
        return request.post(baseUrl, { username, email, tripId, comment });
    }
};