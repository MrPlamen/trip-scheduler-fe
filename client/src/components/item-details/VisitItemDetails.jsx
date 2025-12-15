import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useVisitItem,
  useEditItem,
  useDeleteItem,
  useItemInteractions
} from "../../api/visitItemApi";
import useAuth from "../../hooks/useAuth";
import CommentsShow from "../comment-show/CommentsShow";
import CommentsCreate from "../comments-create/CommentsCreate";
import VisitItemNotFound from "../not-found/VisitItemNotFound";

export default function VisitItemDetails() {
  const { visitItemId } = useParams();
  const navigate = useNavigate();
  const { email, id: userId } = useAuth();

  // ------------------- Load visit item -------------------
  const { visitItem, refetchVisitItem } = useVisitItem(visitItemId);

  // ------------------- Likes & comments -------------------
  const { likes, comments, isLiked, toggleLike } =
    useItemInteractions(visitItemId, userId);

  // ------------------- Local state -------------------
  const [editItem, setEditItem] = useState(false);
  const [newVisitItem, setNewVisitItem] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
  });

  // Local comments state for live updates
  const [localComments, setLocalComments] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const { edit } = useEditItem();
  const { deleteItem } = useDeleteItem();

  // Initialize localComments when comments from hook load
  useEffect(() => {
    if (comments) {
      setLocalComments(comments);
    }
  }, [comments]);

  // ------------------- Handle visit item not found -------------------
  useEffect(() => {
    if (visitItem === null) {
      setNotFound(true);
    } else {
      setNotFound(false);
    }
  }, [visitItem]);

  if (notFound) return <VisitItemNotFound />;

  if (!visitItem) return <div>Loading visit item...</div>;

  const createdDate = new Date(visitItem.date).toLocaleDateString();
  const isOwner = visitItem.ownerId === userId;
  const isMember = true;
  // const isMember = visitItem.members?.some(m => m.email === email);

  // ------------------- Handlers -------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVisitItem((prev) => ({ ...prev, [name]: value }));
  };

  const editVisitItemHandler = () => {
    setEditItem(true);
    setNewVisitItem({
      title: visitItem.title,
      description: visitItem.description,
      imageUrl: visitItem.imageUrl,
      category: visitItem.category || "",
    });
  };

  const visitItemSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await edit(visitItemId, { ...visitItem, ...newVisitItem });
      setEditItem(false);
      refetchVisitItem();
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  const itemDeleteClickHandler = async () => {
    if (!window.confirm(`Delete ${visitItem.title}?`)) return;
    await deleteItem(visitItemId);
    navigate("/visits");
  };

  // Handler to immediately add new comment
  const handleNewComment = (newComment) => {
    setLocalComments(prev => [newComment, ...prev]);
  };

  // ------------------- Render -------------------
  return (
    <section id="trip-details">
      <h2>Visit Point Details</h2>
      <br />

      <div className={`info-section ${editItem ? "edit-mode" : ""}`}>
        <div className="trip-header">
          <img className="trip-img" src={visitItem.imageUrl} alt={visitItem.title} />

          {editItem ? (
            <></>
          ) : (
            <h1>{visitItem.title}</h1>
          )}

          <span className="levels">Created on: {createdDate}</span>

          {editItem ? (
            <input name="category" value={newVisitItem.category} onChange={handleInputChange} />
          ) : (
            <p className="type">{visitItem.category}</p>
          )}

          {editItem ? (
            <>
              <input
                name="title"
                value={newVisitItem.title}
                onChange={handleInputChange}
              />
              <input
                name="imageUrl"
                value={newVisitItem.imageUrl}
                onChange={handleInputChange}
              />
              <input
                name="category"
                value={newVisitItem.category}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                value={newVisitItem.description}
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <br />
              <div className="description-detailed">
                <p className="text">{visitItem.description}</p>
              </div>
            </>
          )}
        </div>

        {/* Likes */}
        {isOwner && !editItem && (
          <div className="likes-section">
            <p>{likes.length} likes</p>
            <button onClick={toggleLike} className="button">
              {isLiked ? "Unlike" : "Like"}
            </button>
          </div>
        )}

        {/* Comments */}
        {isMember && !editItem && <CommentsShow comments={localComments} />}

        {/* Owner buttons */}
        {isOwner && !editItem && (
          <div className="buttons">
            <button onClick={editVisitItemHandler} className="button edit-details-btn">
              Edit
            </button>
            <button onClick={itemDeleteClickHandler} className="button">
              Delete
            </button>
          </div>
        )}

        {/* Comment create */}
        {isMember && !editItem && (
          <CommentsCreate tripId={visitItemId} onCreate={handleNewComment} />
        )}
      </div>

      {/* Save button */}
      {isOwner && editItem && (
        <div className="buttons">
          <br />
          <button onClick={visitItemSubmitHandler} className="button">
            Save Changes
          </button>
        </div>
      )}
    </section>
  );
}
