import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { LogOut, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAdminView, setIsAdminView] = useState(false);

  const fetchTasks = async () => {
    try {
      const endpoint = isAdminView ? '/tasks/admin' : '/tasks';
      const { data } = await API.get(endpoint);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isAdminView]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', { title, description });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await API.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleUpdateStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await API.put(`/tasks/${task._id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  return (
    <div className="dashboard-page">
      <nav className="glass navbar">
        <div className="nav-brand">PrimeTrade AI</div>
        <div className="nav-user">
          <span>Welcome, <strong>{user?.name}</strong> ({user?.role})</span>
          <button onClick={logout} className="btn-icon">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <section className="task-creation">
          <form onSubmit={handleCreateTask} className="glass task-form">
            <h2>Create New Task</h2>
            <input 
              type="text" 
              placeholder="Task Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
            <textarea 
              placeholder="Task Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
            <button type="submit" className="btn-primary">
              <Plus size={18} /> Add Task
            </button>
          </form>
        </section>

        <section className="task-list-section">
          <div className="list-header">
            <h2>Your Tasks</h2>
            {user?.role === 'admin' && (
              <button 
                onClick={() => setIsAdminView(!isAdminView)}
                className={`btn-secondary ${isAdminView ? 'active' : ''}`}
              >
                {isAdminView ? 'Show My Tasks' : 'Admin: Show All User Tasks'}
              </button>
            )}
          </div>

          <div className="tasks-grid">
            {tasks.length === 0 ? (
              <p className="empty-msg">No tasks found. Create one to get started!</p>
            ) : (
              tasks.map(task => (
                <div key={task._id} className="glass task-card">
                  <div className="task-header">
                    <h3 className={task.status === 'completed' ? 'completed-text' : ''}>{task.title}</h3>
                    <div className="task-actions">
                      <button onClick={() => handleUpdateStatus(task)} className="btn-icon success">
                        <CheckCircle size={18} color={task.status === 'completed' ? '#10b981' : '#94a3b8'} />
                      </button>
                      <button onClick={() => handleDeleteTask(task._id)} className="btn-icon danger">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="task-desc">{task.description}</p>
                  <div className="task-footer">
                    <span className={`status-badge ${task.status}`}>
                      <Clock size={12} /> {task.status}
                    </span>
                    {isAdminView && task.user && (
                      <span className="owner-badge">By: {task.user.name}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
