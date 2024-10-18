import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing-page';
import Login from './components/login-page';
import TaskList from './components/task-list';
import TaskForm from './components/task-form';
import Register from './components/register-page';
import Profile from './components/profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/list-tasks" element={<TaskList />} />
        <Route path="/add-task" element={<TaskForm />} />
        <Route path="/edit-task/:taskID" element={<TaskForm />} />
      </Routes>
    </Router>
  );
}

export default App;
