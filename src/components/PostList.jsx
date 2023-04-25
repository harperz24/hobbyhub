import PostItem from "./PostItem";

function PostList({session, displayedPosts}) {
  return (
    <ul className="post-list">
      {displayedPosts.map((post) => (
        <PostItem key={post.id} 
          meId={session.user.id}
          post={post}
        />
      ))}
    </ul>
  )
}

export default PostList;