import { BiCommentDots, BiLike } from "react-icons/bi";

function Toolbar({ commentCount, upvoteCount, postId, upvote, isOnPostView }) {
  return (
    <div className="toolbar">
      <div className="toolbar-section tbc"></div>
        <a href={isOnPostView ? "#comments" : `posts/${postId}`} className="toolbar-section">
          <BiCommentDots />
          <span> {commentCount}</span>
        </a>
      <div className="toolbar-section upvotes" onClick={() => upvote()}><BiLike /><span> {upvoteCount}</span></div>
    </div>
  )
}

export default Toolbar;