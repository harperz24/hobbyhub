import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Layout, Login, Feed, Post, NewPost } from "./routes";
import { fetchLogout } from "./services";
import './App.css';
import { Loading } from "./components";

function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function fetchSession() {
    setIsLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(prev => session);
      }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(prev => session);
      }
    })
    setIsLoading(false);
  }

  const handleLogout = async () => {
    setSession(prev => null);
    await fetchLogout();
  }

  useEffect(() => {
    fetchSession();
  }, []);

  if (isLoading) {
    return <Loading />
  }

  if (!session) {
    return <Login />
  }

  return (
    <BrowserRouter>
      <Routes>
      <Route exact path="login" element={<Login />} />
        <Route path="/" element={ <Layout session={session} handleLogout={handleLogout} /> }>
          <Route index element={<Feed session={session} />} />
          <Route path="posts/:id" element={<Post session={session} />} />
          <Route path="posts/new" element={<NewPost session={session} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;