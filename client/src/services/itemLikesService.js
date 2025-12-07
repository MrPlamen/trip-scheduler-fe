import request from "../utils/request";

const BASE_URL = "http://localhost:8080/visitItemLikes";

export default {
  async getCount(visitItemId) {
    const res = await request.get(`${BASE_URL}/count?visitItemId=${visitItemId}`);
    return res.count ?? 0; 
  },

  async isLiked(visitItemId, userId) {
    const res = await request.get(`${BASE_URL}/isLiked?visitItemId=${visitItemId}&userId=${userId}`);
    return res.liked ?? false; 
  },

  async toggle(visitItemId, userId) {
    const res = await request.post(`${BASE_URL}/toggle?visitItemId=${visitItemId}&userId=${userId}`);
    return res.liked ?? false;
  },

  async getAll(visitItemId) {
    return request.get(`${BASE_URL}/all?visitItemId=${visitItemId}`);
  }
};
