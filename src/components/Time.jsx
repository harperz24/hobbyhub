import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

function Time({ createdAt, updatedAt, isOnComment }) {
  const timeAgo = new TimeAgo('en-US');
  return (
    <div className={isOnComment ? "comment-time" : "post-time" }>
      <span>  ·  </span>
      <span>{timeAgo.format(new Date(createdAt))} </span>
      { updatedAt && <span> ({timeAgo.format(new Date(updatedAt))} edited)</span> }
    </div>
  )
}

export default Time;