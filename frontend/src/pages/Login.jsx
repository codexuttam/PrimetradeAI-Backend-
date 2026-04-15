import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="glass auth-card animate-up" style={{ padding: '4rem 3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div className="logo-icon"><Shield size={32} /></div>
        </div>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textAlign: 'center', marginBottom: '0.5rem' }}>Access Portal</h1>
        <p className="subtitle" style={{ marginBottom: '2.5rem' }}>Initialize session to enter workspace</p>
        
        {error && <div className="error-msg" style={{ marginBottom: '1.5rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group-premium">
            <label>Operator ID (Email)</label>
            <input 
              type="email" 
              className="input-premium"
              placeholder="operator@primetrade.ai" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group-premium">
            <label>Security Key (Password)</label>
            <input 
              type="password" 
              className="input-premium"
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-submit-premium" style={{ marginTop: '1rem' }}>
            Authorize Session <ArrowRight size={18} style={{ marginLeft: 8 }} />
          </button>
        </form>
        
        <p className="auth-footer" style={{ marginTop: '2.5rem' }}>
          New Operator? <Link to="/register" style={{ fontWeight: 800 }}>Apply for Credentials</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
