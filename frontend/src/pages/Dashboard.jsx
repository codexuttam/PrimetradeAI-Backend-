import { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { 
  LogOut, Plus, Trash2, CheckCircle, Clock, 
  Search, Shield, LayoutDashboard, ListTodo, 
  Settings, User as UserIcon, BarChart3, Tag, 
  AlertCircle, ChevronRight, X, Layers
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Work');
  const [isAdminView, setIsAdminView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    return { total, completed, highPriority };
  }, [tasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', { title, description, priority, category });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Work');
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
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon"><Shield size={24} /></div>
          <span>PrimeTrade</span>
        </div>

        <nav className="nav-links">
          <a href="#" className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item">
            <Layers size={20} />
            <span>Project Workspace</span>
          </a>
          {user?.role === 'admin' && (
            <a href="#" className="nav-item" onClick={() => setIsAdminView(!isAdminView)}>
              <BarChart3 size={20} />
              <span>Admin Control</span>
            </a>
          )}
          <a href="#" className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={logout} className="nav-item" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: '#f43f5e' }}>
            <LogOut size={20} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header animate-up">
          <div className="header-title">
            <h1>Workspace Overview</h1>
            <p style={{ color: 'var(--text-dim)' }}>Welcome back, {user?.name}. Manage your ecosystem.</p>
          </div>

          <div className="header-actions">
            <div className="search-bar glass" style={{ border: 'none' }}>
              <Search size={18} className="text-dim" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'none', border: 'none', padding: '0.5rem' }}
              />
            </div>
            <div className="user-profile-btn glass" style={{ padding: '0.75rem 1.25rem' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(var(--primary), var(--secondary))', marginRight: 10 }}></div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid animate-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass stat-card">
            <span className="stat-label">Active Deployments</span>
            <span className="stat-value">{stats.total}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--primary)' }}>
              <ChevronRight size={14} /> View Details
            </div>
          </div>
          <div className="glass stat-card">
            <span className="stat-label">Success Rate</span>
            <span className="stat-value">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
            <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginTop: 15 }}>
              <div style={{ width: `${(stats.completed / stats.total) * 100}%`, height: '100%', background: 'var(--success)', borderRadius: 2 }}></div>
            </div>
          </div>
          <div className="glass stat-card">
            <span className="stat-label">Critical Alerts</span>
            <span className="stat-value">{stats.highPriority}</span>
            <div style={{ color: stats.highPriority > 0 ? 'var(--error)' : 'var(--text-dim)', fontSize: '0.75rem', marginTop: 5 }}>
              {stats.highPriority > 0 ? 'Requires Immediate Action' : 'System Stable'}
            </div>
          </div>
        </div>

        <div className="content-area">
          {/* Main Feed */}
          <section className="animate-up" style={{ animationDelay: '0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{isAdminView ? 'Fleet Overview' : 'Recent Activities'}</h2>
            </div>

            <div className="tasks-container">
              {filteredTasks.length === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '5rem' }}>
                  <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-8867280-7247595.png" alt="Empty" style={{ width: '200px', opacity: 0.3, marginBottom: '2rem' }} />
                  <p className="text-dim">No records found in current segment.</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div key={task._id} className="glass task-card-premium animate-up">
                    <div className="task-meta">
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <span className={`priority-pill priority-${task.priority}`}>{task.priority}</span>
                        <span style={{ color: 'var(--info)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Tag size={12} /> {task.category}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => handleUpdateStatus(task)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.status === 'completed' ? 'var(--success)' : 'var(--text-dim)' }}>
                          <CheckCircle size={22} />
                        </button>
                        <button onClick={() => handleDeleteTask(task._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)' }}>
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <h3 className={task.status === 'completed' ? 'completed-text' : ''}>{task.title}</h3>
                    <p style={{ color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{task.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={14} /> {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                      {isAdminView && task.user && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>Sourced: {task.user.name}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Creation Panel */}
          <section className="animate-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass create-task-panel">
              <h2>Deploy Resource</h2>
              <form onSubmit={handleCreateTask}>
                <div className="form-group-premium">
                  <label>Service Identifier</label>
                  <input 
                    type="text" 
                    className="input-premium"
                    placeholder="E.g. Database Migration" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group-premium">
                  <label>Strategic Priority</label>
                  <div className="select-priority-grid">
                    {['low', 'medium', 'high'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`priority-btn ${priority === p ? 'active' : ''}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group-premium">
                  <label>Classification</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-premium">
                    <option value="Work">Infrastructure</option>
                    <option value="Personal">Personal Ops</option>
                    <option value="Finance">Commercial</option>
                    <option value="Health">Biometrics</option>
                  </select>
                </div>

                <div className="form-group-premium">
                  <label>Deployment Brief</label>
                  <textarea 
                    className="input-premium"
                    style={{ minHeight: 120, resize: 'none' }}
                    placeholder="Operational details..." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                  />
                </div>

                <button type="submit" className="btn-submit-premium">
                  Initialize Deployment
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
