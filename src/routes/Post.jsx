import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { 
  fetchPost, 
  fetchUpdatePost,
  fetchDeletePost, 
  fetchDeleteCommentsOfPost, 
  fetchDeleteUpvotesOfPost
} from "../services";
import { PostItem, Loading, PostForm } from "../components";
import Success from "../components/Success";
import Failure from "../components/Failure";

function Post({ session }) {
  let params = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState();
  const [input, setInput] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [failureMessage, setFailureMessage] = useState('');

  function handleEdit() {
    setIsEditing(true);
  }

  function handleChange(e) {
    setInput(prevInput => ({
      ...prevInput,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdatePost(params.id, {
      title: input.title,
      content: input.content,
      image: input.image,
      updated_at: new Date(Date.now()).toISOString()
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  async function onGetPost(id) {
    setIsLoading(true);
    try {
      const { data } = await fetchPost(id);
      setPost(data);
      setInput({
        title: data.title,
        content: data.content,
        image: data.image,
      });
    } catch(error) {
      console.log(error);
      setFailureMessage(error.message);
    }
    setIsLoading(false);
  }

  async function onUpdatePost(id, updatedPost) {
    setIsLoading(true);
    try {
      const { data } = await fetchUpdatePost(id, updatedPost);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  async function onDeletePost(id) {
    setIsLoading(true);
    try {
      await fetchDeleteCommentsOfPost(id);
      await fetchDeleteUpvotesOfPost(id);
      await fetchDeletePost(id);
      setSuccessMessage("Post deleted, navigating to feed...")
      setTimeout(() => {
        navigate('/');
      }, 1000); 
    } catch (error) {
      console.log(error);
      setFailureMessage(error.message);
    }
  }

  useEffect(() => { 
    onGetPost(params.id);

    const postsChannel = supabase.channel(`public:posts:id=eq.${params.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'posts', 
          filter: `id=eq.${params.id}`
        },
        (payload) => {
          console.log('UPDATE received!', payload);
          setPost(prev => payload.new);
        }
      ).subscribe();

    return () => {
      postsChannel.unsubscribe();
    };
  }, []);

  if (isEditing) {
    return (
      <div className="post-form-container">
        <h2>Update post</h2>
        <PostForm
          input={input}
          isOnSingleView={true}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          submitDisabled={
            input.title.trim() === post.title.trim() &&
            input.content.trim() === post.content.trim() && 
            input.image.trim() === post.image.trim()
          }
        />
      </div>
    )
  }

  if (successMessage) {
    return <Success message={successMessage} />
  }

  if (failureMessage) {
    return <Failure message={failureMessage} />
  }

  if (isLoading || !post) {
    return <Loading />
  }

  return (
    <div className="post-item-on-post">
      <PostItem 
        post={post}
        meId={session.user.id} 
        onDelete={onDeletePost}
        onEdit={handleEdit}
        isOnPostView={true}
      />
    </div>
  )
}

export default Post;