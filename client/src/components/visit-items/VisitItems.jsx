import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import itemLikesService from "../../services/itemLikesService";
import { useDeleteItem } from "../../api/visitItemApi";
import "./VisitItems.css";

export default function VisitItems({ visitItems, email, userId, onEdit }) {
  const [likes, setLikes] = useState({});
  const [userLiked, setUserLiked] = useState({});
  const { deleteItem } = useDeleteItem();

  useEffect(() => {
    const loadLikes = async () => {
      const likesObj = {};
      const userLikedObj = {};

      for (const item of visitItems) {
        if (!item?.id && !item?._id) continue;
        const id = item.id ?? item._id;

        likesObj[id] = await itemLikesService.getCount(id);
        userLikedObj[id] = await itemLikesService.isLiked(id, userId);
      }

      setLikes(likesObj);
      setUserLiked(userLikedObj);
    };

    if (visitItems.length > 0) loadLikes();
  }, [visitItems, userId]);

  const toggleLike = async (visitItemId) => {
    const newLiked = await itemLikesService.toggle(visitItemId, userId);
    const newCount = await itemLikesService.getCount(visitItemId);

    setLikes((prev) => ({ ...prev, [visitItemId]: newCount }));
    setUserLiked((prev) => ({ ...prev, [visitItemId]: newLiked }));
  };

  const itemDeleteClickHandler = useCallback(
    async (visitItemId) => {
      const hasConfirm = confirm("Are you sure you want to delete this place for visit?");
      if (!hasConfirm) return;

      await deleteItem(visitItemId);
      window.location.reload();
    },
    [deleteItem]
  );

  const sortedVisitItems = [...visitItems]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aId = a.item.id ?? a.item._id;
      const bId = b.item.id ?? b.item._id;

      const diff = (likes[bId] ?? 0) - (likes[aId] ?? 0);
      return diff !== 0 ? diff : a.index - b.index;
    })
    .map(wrapper => wrapper.item);

  return (
    <>
      <h2>Visit points</h2>
      <div id="visit-items">
        {sortedVisitItems && sortedVisitItems.length > 0 ? (
          sortedVisitItems.map((item) => {
            if (!item) return null;

            const id = item.id ?? item._id;
            const isOwner = userId === item._ownerId;

            return (
              <div key={id} className="visit-item-card">
                <img src={item.imageUrl} alt={item.title} />
                <h3>{item.title}</h3>
                <p>
                  <Link to={`/visits/${id}/details`} className="visit-item-card-link">
                    Details
                  </Link>
                </p>

                <div className="visit-item-container">
                  <p className="visit-item-description">{item.description}</p>
                </div>

                <div className="likes-wrapper">
                  <span className="likes-hero-1">Likes: {likes[id] ?? 0}</span>

                  <div className="likes-section">
                    <button onClick={() => toggleLike(id)} className="button">
                      {userLiked[id] ? "Unlike" : "Like"}
                    </button>

                    {isOwner && (
                      <div className="buttons">
                        <button
                          onClick={() => onEdit(item)}
                          className="button edt-btn edit-details-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => itemDeleteClickHandler(id)}
                          className="button"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
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
