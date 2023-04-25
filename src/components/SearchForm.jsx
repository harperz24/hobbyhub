import { BiSearch } from "react-icons/bi";

function SearchForm({ keywords, handleSearchChange, handleSearchSubmit }) {
  return (
    <form className="search-form" onSubmit={(e) => handleSearchSubmit(e)}>
      <input placeholder="title keyword" value={keywords} onChange={(e) => handleSearchChange(e)} />
      <button type="submit"><BiSearch /></button>
      {/* <Link to={`?title=${keyword}`}>Search</Link> */}
    </form>
  )
}

export default SearchForm;