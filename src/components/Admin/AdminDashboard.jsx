import { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    import('../../data/portfolio.json').then((module) => {
      setData(module.default);
    });
  }, []);

  const handleChange = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleJsonChange = (section, value) => {
    try {
      const parsed = JSON.parse(value);
      setData((prev) => ({
        ...prev,
        [section]: parsed
      }));
    } catch (e) {
      // Ignore invalid JSON while typing
    }
  };

  const handleSave = async () => {
    setStatus('Saving...');
    try {
      const response = await fetch('http://localhost:5000/api/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setStatus('Saved successfully!');
        setTimeout(() => setStatus(''), 3000);
      } else if (response.status === 401) {
        setStatus('Unauthorized! Please log in again.');
        handleLogout();
      } else {
        setStatus('Failed to save (Server Error)');
      }
    } catch (error) {
      console.error(error);
      setStatus('Failed to save. Is the local server running?');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      
      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('adminToken', result.token);
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      setLoginError('Server error. Is backend running?');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="login-header">
            <h2>Port<span>Admin</span></h2>
            <p>Sign in to manage your portfolio</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required placeholder="admin@admin.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            {loginError && <div className="login-error">{loginError}</div>}
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Login</button>
            <button type="button" className="btn-outline-full" style={{ width: '100%', marginTop: '10px' }} onClick={() => navigate('/')}>Return to Site</button>
          </form>
        </div>
      </div>
    );
  }

  if (!data) return <div className="admin-loading">Loading Dashboard...</div>;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-brand">
          <h2>Port<span>Admin</span></h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'personalInfo' ? 'active' : ''}`}
            onClick={() => setActiveTab('personalInfo')}
          >
            👤 Personal Info
          </button>
          <button 
            className={`nav-item ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            🛠️ Skills
          </button>
          <button 
            className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            📂 Projects
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-outline-full" onClick={() => navigate('/')} style={{marginBottom: '10px'}}>
            ← Back to Site
          </button>
          <button className="btn-outline-full" onClick={handleLogout} style={{borderColor: '#ff4757', color: '#ff4757'}}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title="Toggle Sidebar"
            >
              {isSidebarOpen ? '✕' : '☰'}
            </button>
            <div>
              <h1>Dashboard</h1>
              <p className="subtitle">Manage your portfolio content</p>
            </div>
          </div>
          <div className="header-actions">
            {status && (
              <span className={`status-badge ${status.includes('Failed') ? 'error' : 'success'}`}>
                {status}
              </span>
            )}
            <button className="btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        </header>

        <div className="admin-content-area">
          {activeTab === 'personalInfo' && (
            <div className="admin-card fade-in">
              <h3>Personal Information</h3>
              <p className="card-description">Update your basic details and social links.</p>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={data.personalInfo.name} onChange={(e) => handleChange('personalInfo', 'name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Tagline</label>
                  <input type="text" value={data.personalInfo.tagline} onChange={(e) => handleChange('personalInfo', 'tagline', e.target.value)} />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea rows="4" value={data.personalInfo.description} onChange={(e) => handleChange('personalInfo', 'description', e.target.value)}></textarea>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={data.personalInfo.email} onChange={(e) => handleChange('personalInfo', 'email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>GitHub Profile</label>
                  <input type="text" value={data.personalInfo.github} onChange={(e) => handleChange('personalInfo', 'github', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>LinkedIn Profile</label>
                  <input type="text" value={data.personalInfo.linkedin} onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="admin-card fade-in">
              <h3>Skills Data</h3>
              <p className="card-description">Edit your skills configuration in JSON format.</p>
              <div className="form-group">
                <textarea 
                  rows="20" 
                  defaultValue={JSON.stringify(data.skills, null, 2)}
                  onChange={(e) => handleJsonChange('skills', e.target.value)}
                  className="json-editor"
                ></textarea>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="admin-card fade-in">
              <h3>Projects Data</h3>
              <p className="card-description">Edit your projects configuration in JSON format.</p>
              <div className="form-group">
                <textarea 
                  rows="25" 
                  defaultValue={JSON.stringify(data.projects, null, 2)}
                  onChange={(e) => handleJsonChange('projects', e.target.value)}
                  className="json-editor"
                ></textarea>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
