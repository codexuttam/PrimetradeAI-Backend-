import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="glass auth-card animate-up" style={{ padding: '4rem 3rem', maxWidth: 450 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div className="logo-icon"><Shield size={32} /></div>
        </div>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textAlign: 'center', marginBottom: '0.5rem' }}>Personnel Enrollment</h1>
        <p className="subtitle" style={{ marginBottom: '2.5rem' }}>Register new operator credentials</p>
        
        {error && <div className="error-msg" style={{ marginBottom: '1.5rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group-premium">
            <label>Legal Name</label>
            <input 
              type="text" 
              className="input-premium"
              placeholder="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group-premium">
            <label>Operations Email</label>
            <input 
              type="email" 
              className="input-premium"
              placeholder="name@primetrade.ai" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group-premium">
            <label>Encryption Key (Password)</label>
            <input 
              type="password" 
              className="input-premium"
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group-premium">
            <label>Access Level</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input-premium">
              <option value="user">Standard Agent</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <button type="submit" className="btn-submit-premium" style={{ marginTop: '1rem' }}>
            Initialize Enrollment <UserPlus size={18} style={{ marginLeft: 8 }} />
          </button>
        </form>
        
        <p className="auth-footer" style={{ marginTop: '2.5rem' }}>
          Already Registered? <Link to="/login" style={{ fontWeight: 800 }}>Primary Access</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
