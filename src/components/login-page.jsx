import { Link } from 'react-router-dom';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email, password });
      console.log('Login successful, response data:', response.data);
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/list-tasks');
    } 
    catch (err) {
      console.error('Login failed:', err);
      setError(err.response ? err.response.data.error : 'Error logging in');
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h2>Login</h2>
          <Link to="/register">
            <button className="btn btn-secondary create-account-button">Create an Account</button>
          </Link>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <form onSubmit={handleLogin} className="login-form mt-4">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
