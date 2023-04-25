import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loading, PostForm, PostList, SearchForm, SortForm } from "../components";
import { fetchPosts, fetchCreatePost, fetchSearchByTitle } from "../services";
import { supabase } from "../supabaseClient";

function Feed({ session }) {
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);

  const [sortBy, setSortBy] = useState('created_at');
  const [searchParams, setSearchParams]  = useSearchParams();
  const [keywords, setKeywords] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const initInput= {
    title: "",
    content: "",
    image: "",
  }
  const [input, setInput] = useState(initInput);

  function handleChange(e) {
    setInput(prevInput => ({
      ...prevInput,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onCreatePost({
      creator_id: session.user.id,
      title: input.title,
      content: input.content,
      image: input.image,
    });
    setInput(prev => initInput);
  }

  async function onGetPosts() {
    setIsLoading(true);
    try {
      const { data } = await fetchPosts();
      setPosts(prev => data);
      setDisplayedPosts(prev => data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  async function onCreatePost(post) {
    try {
      await fetchCreatePost(post);
    } catch (error) {
      console.log(error);
    }
  }

  ////////////////////////////////////////////////////////////////////// sort, filter
  function handleSearchChange(e) {
    setKeywords(prev => e.target.value);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!keywords.trim()) {
      return;
    }
    onSearch(keywords);
  }

  async function handleSortSubmit(e) {
    setSortBy(prev => e.target.value);
    e.preventDefault();
    const { data } = await fetchPosts();
    setPosts(prev => data);
    if (e.target.value === "upvotes") {
      setDisplayedPosts(prev => posts.toSorted((a, b) => b.upvotes[0].count - a.upvotes[0].count));
    } else {
      setDisplayedPosts(posts);
    }
  }

  async function onSearch(keywords) {
    try {
      const { data } = await fetchSearchByTitle(keywords.split(';').join(" & "));
      setDisplayedPosts(prev => data);
      console.log("results", data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const postsChannel = supabase.channel("public:posts")
    .on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'posts', 
      },
      (payload) => {
        console.log('INSERT received!', payload);
        setDisplayedPosts(prev => [payload.new, ...prev]);
      }
    ).subscribe();

    onGetPosts();

    return () => {
      postsChannel.unsubscribe();
    };

  }, []);

  if (isLoading) {
    return <Loading />
  }

  if (!posts.length) {
    return <h2>No posts yet</h2>
  }

  return (
    <div className="feed">
      <PostForm 
        input={input}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submitDisabled={!input.title.trim()}
      />

      <div className="sort-filter-bar">
        <SearchForm 
          keywords={keywords} 
          handleSearchChange={handleSearchChange} 
          handleSearchSubmit={handleSearchSubmit} 
        />
        <SortForm sortBy={sortBy} handleSortSubmit={handleSortSubmit} />
      </div>

      <PostList 
        session={session}
        displayedPosts={displayedPosts} 
        />
    </div>
  )
}

export default Feed;