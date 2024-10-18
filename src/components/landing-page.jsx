import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div>
      <h1 className="display-4 text-center mt-5">Welcome to Task Manager!</h1>
      <p className="text-center mt-3 fs-5">Create and manage project tasks!</p>

      <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4 mb-5">
          <Link to="/login">
            <button className="btn btn-primary fs-5">Login</button>
          </Link>
      </div>
    </div>
  );
}

export default LandingPage;
