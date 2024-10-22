import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../axios';
import Header from './header';

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ total: 0, completed: 0 });

  const progressPercentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found, please login again.');
        }
        const response = await api.get('/tasks/progress');
        setProgress(response.data);
      } 
      catch (err) {
        setError(`Error fetching task progress: ${err.response?.data?.error || err.message}`);
      }
    };
    fetchProgress();
  }, [tasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found, please login again.');
        }
        const response = await api.get('/tasks');
        setTasks(response.data);
      } 
      catch (err) {
        setError(`Error fetching tasks: ${err.response?.data?.error || err.message}`);
      }
    };
    fetchTasks();
  }, []);

  const deleteProjects = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } 
    catch (err) {
      setError(`Error deleting task: ${err.response?.data?.error || err.message}`);
    }
  };

  const cutOffText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div id="tasks">
      <Header />

      <div className="container-custom mt-3">
        <h1>Tasks</h1>

        <div className="mt-4">
          <Link to="/add-task">
            <button className="btn btn-primary">Add Task</button>
          </Link>
        </div>

        <br />

        <h3>Progress:</h3>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {Math.round(progressPercentage)}%
          </div>
        </div>
        <p>{progress.completed} out of {progress.total} tasks completed</p>

        {error && <p className="text-danger">{error}</p>}

        {tasks.length > 0 ? (
          <table className="table table-striped mt-4">
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <div className='fw-bold fs-4'>
                      {cutOffText(task.title, 30)}
                      {<button className="btn btn-success ms-3">Status: {task.status}</button>}
                    </div>
                    <div>{cutOffText(task.description, 90)}</div>
                  </td>
                  <td className="text-end">
                    <Link to={`/edit-task/${task.id}`}>
                      <button className="btn btn-secondary me-2">Edit</button>
                    </Link>
                    <button
                      className="btn btn-danger me-2"
                      onClick={() => deleteProjects(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
    </div>
  );
}

export default TaskListPage;
