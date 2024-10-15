import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header';

function TaskFormPage() {
  const { taskID } = useParams();
  const editMode = Boolean(taskID); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log(editMode);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Not started',
  });

  useEffect(() => {
    if (editMode) {
      const fetchTaskData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `http://localhost:4000/api/tasks/${taskID}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          
          const task = response.data;
          setFormData({
            title: task.title,
            description: task.description || '',
            status: task.status,
          });
        }
        catch (err) {
          setError(`Error fetching task: ${err.message}`);
        }
      };
      fetchTaskData();
    }
  }, [editMode, taskID]);

  const editForm = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const submit = async (e) => {
    e.preventDefault(); 
  
    try {
      if (editMode) {
        await axios.put(`http://localhost:4000/api/tasks/${taskID}`, formData);
      } 
      else {
        const token = localStorage.getItem('token');

        await axios.post(
          'http://localhost:4000/api/tasks',
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      navigate('/list-tasks');
    } 
    catch (err) {
      setError(`Error saving tasks: ${err.message}`);
    }
  };

  return (
    <div id="root">
      <Header />

      <div className="container-custom mt-3">
        <h1> {editMode ? 'Edit Task' : 'Add Task'} </h1>
        <p> Fill in the form below to {editMode ? 'edit this' : 'create a new'} task. </p>

        {error && <p className="text-danger">{error}</p>}
        
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={editForm}
              className="form-control"
              required
            />
            <p className="text-muted small">The name of your task.</p>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={editForm}
              className="form-control"
              rows="2"
              required
            />
            <p className="text-muted small">Provide a brief description of your task.</p>
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={editForm}
              className="form-select"
              required
            >
              <option value="Not started">Not started</option>
              <option value="In progress">In progress</option>
              <option value="Finished">Finished</option>
            </select>
            <p className="text-muted small">Select status of task.</p>
          </div>

          <button type="submit" className="btn btn-success mb-4">Save Project</button>
        </form>
      </div>

    </div>
  );
}

export default TaskFormPage;
