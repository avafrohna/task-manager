import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function TaskFormPage() {
  const { taskID } = useParams();
  const editMode = Boolean(taskID); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Not started',
  });

  useEffect(() => {
    if (editMode) {
      const fetchProjectData = async () => {
        try {
          const task = [
            { id: 1, title: "Sample Task 1", status: "In Progress" },
          ];
          setFormData({
            title: task[0].title,
            description: task[0].description || '',
            status: task[0].status,
          });
        }
        catch (err) {
          setError(`Error fetching task: ${err.message}`);
        }
      };
      fetchProjectData();
    }
  }, []);

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
        // edit task
      } 
      else {
        // create task
      }
      navigate('/list-tasks');
    } 
    catch (err) {
      setError(`Error saving tasks: ${err.message}`);
    }
  };

  return (
    <div id="root">

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
