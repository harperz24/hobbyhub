function CommentForm({ input, handleChange, handleSubmit }) {
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <textarea 
        name="content" placeholder="Leave a comment ..." required 
        rows={2}
        value={input} 
        onChange={(e) => handleChange(e)} 
      />
      <button type="submit" disabled={!input.trim()}>Submit</button>
    </form>
  )
}

export default CommentForm;