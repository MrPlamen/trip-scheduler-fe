import request from "../utils/request";

const baseUrl = 'http://localhost:8080/jsonstore/itemLikes';

export default {
    async getAll(visitItemId) {
        const likes = await request.get(baseUrl);

        const tripLikes = Object.values(likes).filter(like => like.visitItemId === visitItemId);

        return tripLikes;
    },
    createItemLike(email, visitItemId, like, userId) {
        
        return request.post(baseUrl, { email, visitItemId, like, userId });
    },

    async delete(email, visitItemId) {
        const likes = await request.get(baseUrl);
        const itemLikes = Object.values(likes).filter(like => like.visitItemId === visitItemId && like.email === email);

        if (itemLikes.length > 0) {
            const likeId = itemLikes[0]._id; 
            await request.delete(`${baseUrl}/${likeId}`); 
        }
    }
};