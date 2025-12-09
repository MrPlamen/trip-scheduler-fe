export default function CommentsShow({ comments }) {
    if (!comments || comments.length === 0) return <p>No comments yet.</p>;

    return (
        <ul className="comments-list">
            {comments.map(comment => (
                <li key={comment.id} className="comment-item">
                    <strong>{comment.username ? comment.username : comment.email}</strong>: {comment.comment}
                </li>
            ))}
        </ul>
    );
}
