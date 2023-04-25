import { useState } from "react";
import { fetchCreatePost } from "../services";
import { Loading, PostForm } from "../components";
import { useNavigate } from "react-router-dom";
import Success from "../components/Success";

function NewPost({ session }) {
  const navigate = useNavigate();
  const initInput= {
    title: "",
    content: "",
    image: "",
  }
  const [input, setInput] = useState(initInput);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(e) {
    setInput(prevInput => ({
      ...prevInput,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    setIsLoading(true);
    e.preventDefault();
    onCreatePost({
      creator_id: session.user.id,
      title: input.title,
      content: input.content,
      image: input.image,
    });
    setSuccessMessage("Successfully submitted, navigating to feed ...")
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }

  function handleCancel() {
    navigate(-1);
  }

  async function onCreatePost(post) {
    try {
      await fetchCreatePost(post);
    } catch (error) {
      console.log(error);
    }
  }

  if (successMessage) {
    return <Success message={successMessage} />
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="post-form-container">
      <h2>Create post</h2>
      <PostForm 
        input={input}
        isOnSingleView={true}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        submitDisabled={!input.title.trim()}
    />
    </div>
  )
}

export default NewPost;