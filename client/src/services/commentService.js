import request from "../utils/request";

const baseUrl = "http://localhost:8080/comments";

export default {
    async getAll(parentId) {
        return request.get(`${baseUrl}/trip/${parentId}`);
    },

    create(username, email, tripId, commentText) {
        return request.post(baseUrl, {
            username,
            email,
            tripId,
            comment: commentText  
        });
    },
    
    delete(id) {
        return request.del(`${baseUrl}/${id}`);
    }
};
