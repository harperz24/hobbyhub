import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  fetchComments, 
  fetchDeleteComment, 
  fetchCreateComment,
  fetchUpvotes, 
  fetchCreateUpvote,
} from "../services";
import Creator from "./Creator";
import Time from "./Time";
import Toolbar from "./Toolbar";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { supabase } from "../supabaseClient";

function PostItem({ meId, post, onDelete, onEdit, isOnPostView }) {
  const [comments, setComments] = useState([]);
  const [upvotesCount, setUpvotesCount] = useState(0);
  const [commentInput, setCommentInput] = useState("");

  // comments
  function handleChange(e) {
    setCommentInput(prevInput => e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onCreateComment({
      post_id: post.id,
      creator_id: meId,
      content: commentInput
    });
    setCommentInput(prev => "");
  }

  async function onGetComments(postId) {
    try {
      const { data } = await fetchComments(postId);
      setComments(prev => data);
    } catch (error) {
      console.log(error);
    }
  }

  async function onCreateComment(newComment) {
    try {
      const { data } = await fetchCreateComment(newComment);
    } catch(error) {
      console.log(error);
    }
  }

  async function onDeleteComment(id) {
    try {
      const {data} = await fetchDeleteComment(id);
    } catch (error) {
      console.log(error);
    }
  }

  // upvotes
  async function onGetUpvotesCount(postId) {
    try {
      const { data } = await fetchUpvotes(postId);
      if (data) setUpvotesCount(prev => data.length);
    } catch (error) {
      console.log(error);
    }
  }

  async function onCreateUpvote() {
    try {
      const { data } = await fetchCreateUpvote({
        post_id: post.id,
        creator_id: meId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const commentsChannel = supabase.channel(`public:comments:post_id=${post.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'comments', 
          filter: `post_id=eq.${post.id}`
        },
        (payload) => {
          console.log('INSERT received!', payload);
          setComments(prev => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'comments', 
          filter: `post_id=eq.${post.id}`
        },
        (payload) => {
          console.log('DELETE received!', payload);
          setComments(prev => prev.filter((comment) => comment.id !== payload.old.id));
        }
      )
      .subscribe();
    
    const upvotesChannel = supabase.channel(`public:upvotes:post_id=${post.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'upvotes', 
          filter: `post_id=eq.${post.id}`
        },
        (payload) => {
          console.log('INSERT received!', payload);
          setUpvotesCount(prev => prev + 1);
        }
      ).subscribe();
    

    onGetComments(post.id);
    onGetUpvotesCount(post.id);


    return () => {
      commentsChannel.unsubscribe();
      upvotesChannel.unsubscribe();
    };
  }, []);

  return (
    <div key={post.id} className="post-item">
      <div className="post-management">
        <Creator creatorId={post.creator_id} showUsername={true} />
        <Time createdAt={post.created_at} updatedAt={post.updated_at} />

        { isOnPostView && post.creator_id === meId && 
          <div className="buttons">
            <button className="edit" onClick={() => onEdit()}>Edit</button>
            <button className="delete" onClick={() => onDelete(post.id)}>Delete</button>
          </div>
        }
      </div>
      
      <div className="post-block">
        { isOnPostView
          ? <h4>{post.title}</h4>
          : <Link to={`posts/${post.id}`}>{post.title}</Link>
        }
        { isOnPostView && 
          <>
            { post.content && <p>{post.content}</p> }
            { post.image && <img src={post.image} alt={`image for ${post.id}`} /> }
          </>
        }

        <Toolbar 
          commentCount={comments.length} 
          upvoteCount={upvotesCount} 
          postId={post.id}
          isOnPostView={isOnPostView}
          upvote={onCreateUpvote}
        />
        { isOnPostView &&
          <>
            <div className="create-comment">
              <Creator creatorId={meId} isOnComment={true} />
              <CommentForm
                input={commentInput}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            </div>

            <CommentList comments={comments} meId={meId} onDelete={onDeleteComment} /> 
          </>
        }
      </div> 
    </div>
  )
}

export default PostItem;