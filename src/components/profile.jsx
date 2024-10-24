import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../axios';
import Header from './header';

function ProfilePage() {
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetched token:', token);
        if (!token) {
          throw new Error('No token found, please login again.');
        }

        const response = await api.get('/user');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(response.data);
      } 
      catch (err) {
        setError(`Error fetching user: ${err.response?.data?.error || err.message}`);
      }
    };

    fetchUser();
  }, []);

  return (
    <div id="tasks">
      <Header />
      
      <div className="container-custom mt-3">
        <h1>User Profile</h1>

        {error && <p className="text-danger">{error}</p>}
      
        <p><strong>First Name:</strong> {user.firstname}</p>
        <p><strong>Last Name:</strong> {user.lastname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <Link to="/login">
          <button className="btn btn-danger fs-5">Logout</button>
        </Link>
      </div>
    </div>
  );  
}

export default ProfilePage;
