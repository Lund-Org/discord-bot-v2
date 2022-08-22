import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/ranks">Leaderboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
