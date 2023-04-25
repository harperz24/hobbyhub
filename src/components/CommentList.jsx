import { BiTrash } from "react-icons/bi";
import Creator from "./Creator";
import Time from "./Time";

function CommentList({ comments, meId, onDelete }) {
  if (!comments.length) {
    return <div id="comments" className="comment-list no-comments">no comments yet</div>
  }

  return (
    <ul id="comments" className="comment-list">{comments.map(comment => (
      <li key={comment.id}>
        <div className="comment-management">
          <Creator creatorId={comment.creator_id} isOnComment={true} showUsername={true} />
          <Time createdAt={comment.created_at} isOnComment={true} />
          { comment.creator_id === meId && <button onClick={() => onDelete(comment.id)}><BiTrash /></button> }
        </div>
        <div className="comment-block">
          {comment.content}
        </div>
      </li>
    ))}
    </ul>
  )
}

export default CommentList;