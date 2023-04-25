function SortForm({ sortBy, handleSortSubmit }) {
  return (
    <form className="sort-form">
      <label>
        <span>Sort by:  </span>
        <select name="sortBy" value={sortBy} onChange={(e) => handleSortSubmit(e)}>
          <option value="created_at">Created at ↓</option>
          <option value="upvotes">Upvotes ↓</option>
        </select>
      </label>
    </form>
  )
}

export default SortForm;