import { useState, useEffect } from "react";
import { fetchCreator } from "../services";
import { BiGame } from "react-icons/bi";

function Creator({ creatorId, showUsername, isOnNavbar, isOnComment }) {
  const [creator, setCreator] = useState({});

  async function getCreator(id) {
    try {
      const { data } = await fetchCreator(id);
      if (!data) {
        throw Error(`User with id ${id} not found.`)
      }
      setCreator(prev => data);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCreator(creatorId);
  }, []);

  return (
    <div className="creator">
      <div className={`${isOnNavbar || isOnComment ? "small-avatar" : "avatar"} ${creator.avatar_color}`}><BiGame /></div>
      { showUsername && <h4>{creator.username}</h4> }
    </div>
  )
}

export default Creator;