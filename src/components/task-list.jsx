import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function TaskListPage() {
  const [error, setError] = useState(null);

  const tasks = [
    { id: 1, title: "Sample Task 1", status: "In Progress" },
    { id: 2, title: "Sample Task 2", status: "To Do" },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // get tasks
      } 
      catch (err) {
        setError(`Error fetching projects: ${err.message}`);
      }
    };
  
    fetchProjects();
  }, []);

  const deleteProjects = async (id) => {
    try {
      // delete task
    } 
    catch (err) {
      setError(`Error deleting project: ${err.message}`);
    }
  };

  const cutOffText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div id="root">
  
      <div className="container-custom mt-3">
        <h1 className=''>
          Tasks
        </h1>

        <div className="mt-4">
          <Link to="/add-task">
            <button className="btn btn-primary">Add Task</button>
          </Link>
        </div>

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
                    <div>{cutOffText(task.description, 110)}</div>
                  </td>
                  <td className="text-end">
                    <Link to={`/edit-task/${task.id}`}>
                      <button className="btn btn-secondary me-2">Edit</button>
                    </Link>
                    <button
                      className="btn btn-danger me-2"
                      onClick={() => deleteProjects(task.id)}>Delete</button>
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
