import { Link } from "react-router-dom";
import { Creator } from "../components";

function NavBar({ session, handleLogout }) {

  return (
    <nav>
      <Link to="/"><h3 className="brand">Game Hobbyhub</h3></Link>
      <ul className="navbar-right">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/posts/new">Create Post</Link></li>
        <li className="me">
          <Creator creatorId={session.user.id} showUsername={true} isOnNavbar={true} />
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;