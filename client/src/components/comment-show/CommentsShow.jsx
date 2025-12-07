export default function CommentsShow({ comments }) {

    return (
        <div className="details-comments">
            <h2>Comments:</h2>
            <ul>
                {comments.length > 0
                    ? comments.map(comment => (
                        <li key={comment._id} className="comment">
                            <p>
                                {comment.username ? comment.username : comment.email}: {comment.comment}
                            </p>
                        </li>
                    ))
                    : <p className="no-comment">No comments.</p>
                }
            </ul>
        </div>
    );
}