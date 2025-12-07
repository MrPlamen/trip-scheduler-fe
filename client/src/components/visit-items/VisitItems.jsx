import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import itemLikesService from "../../services/itemLikesService";
import { useDeleteItem } from "../../api/visitItemApi";
import './VisitItems.css';

export default function VisitItems({ visitItems, email, userId, onEdit }) {
  const [likes, setLikes] = useState({}); // { visitItemId: count }
  const [userLiked, setUserLiked] = useState({}); // { visitItemId: true/false }
  const { deleteItem } = useDeleteItem();

  // Load initial likes and user like status
  useEffect(() => {
    const loadLikes = async () => {
      const likesObj = {};
      const userLikedObj = {};

      for (const item of visitItems) {
        if (!item.id && !item._id) continue; // safety check

        const id = item.id ?? item._id;

        try {
          likesObj[id] = await itemLikesService.getCount(id);
          userLikedObj[id] = await itemLikesService.isLiked(id, userId);
        } catch (err) {
          console.error("Failed loading likes for item:", id, err);
        }
      }

      setLikes(likesObj);
      setUserLiked(userLikedObj);
    };

    if (visitItems.length > 0) loadLikes();
  }, [visitItems, userId]);

  const toggleLike = async (visitItemId) => {
    try {
      const newLiked = await itemLikesService.toggle(visitItemId, userId);
      const newCount = await itemLikesService.getCount(visitItemId);

      setLikes((prev) => ({ ...prev, [visitItemId]: newCount }));
      setUserLiked((prev) => ({ ...prev, [visitItemId]: newLiked }));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const itemDeleteClickHandler = useCallback(async (visitItemId) => {
    const hasConfirm = confirm(`Are you sure you want to delete this place for visit?`);
    if (!hasConfirm) return;

    await deleteItem(visitItemId);
    window.location.reload(); // simple reload to refresh list
  }, [deleteItem]);

  return (
    <>
      <h2>Visit points</h2>
      <div id="visit-items">
        {visitItems && visitItems.length > 0 ? (
          visitItems.map((item) => {
            if (!item) return null;

            const id = item.id ?? item._id;
            const isOwner = userId === item._ownerId;

            return (
              <div key={id} className="visit-item-card">
                <img src={item.imageUrl} alt={item.title} />
                <h3>{item.title}</h3>
                <p><Link to={`/visits/${id}/details`} className="visit-item-card-link">Details</Link></p>
                <p>{item.description}</p>
                <span>Likes: {likes[id] ?? 0}</span>
                <div className="likes-section">
                  <button
                    onClick={() => toggleLike(id)}
                    className="button"
                  >
                    {userLiked[id] ? "Unlike" : "Like"}
                  </button>

                  {isOwner && (
                    <div className="buttons">
                      <button onClick={() => onEdit(item)} className="button edt-btn edit-details-btn">Edit</button>
                      <button onClick={() => itemDeleteClickHandler(id)} className="button">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No visit items for this trip yet.</p>
        )}
      </div>
    </>
  );
}
