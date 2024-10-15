import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light py-3">
      <div className="container-fluid">
        <Link to="/list-tasks" className="navbar-brand fs-3 ms-4">TASK MANAGER</Link>
        <ul className="navbar-nav ms-auto">
          <Link to="/profile" className="nav-link fs-3">Profile</Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
