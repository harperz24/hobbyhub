function PostForm({ input, isOnSingleView, handleChange, handleSubmit, handleCancel, submitDisabled }) {
  return (
    <form className="post-form" onSubmit={(e) => handleSubmit(e)}>
      <input 
        name="title" type="text" required 
        placeholder="title: what is happening?"
        value={input.title} onChange={(e) => handleChange(e)} 
      />
      <textarea 
        name="content" rows={2} type="text" 
        placeholder="content: share more details! (optional)"
        value={input.content} onChange={(e) => handleChange(e)} 
      />
      <input 
        name="image" type="text" 
        placeholder="image: add a link! (optional)" 
        value={input.image} onChange={(e) => handleChange(e)} 
      />
      <div className="buttons">
        <button type="submit" disabled={submitDisabled}>Submit</button>
        { isOnSingleView && <button onClick={() => handleCancel()}>Cancel</button> }

      </div>
    </form>
  )
}

export default PostForm;