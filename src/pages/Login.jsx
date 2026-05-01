import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

/* ── Inline SVG Logo ─────────────────────────────────── */
const BrandLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="14" fill="url(#authLogoGrad)"/>
    <circle cx="24" cy="24" r="13" stroke="white" strokeWidth="2.5" fill="none"/>
    <circle cx="24" cy="24" r="8"  stroke="white" strokeWidth="2.5" fill="none"/>
    <circle cx="24" cy="24" r="3"  fill="white"/>
    <line x1="24" y1="7"  x2="24" y2="11" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="24" y1="37" x2="24" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <defs>
      <linearGradient id="authLogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0ea5e9"/>
        <stop offset="1" stopColor="#67e8f9"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('name',  data.name);
      localStorage.setItem('email', data.email);
      localStorage.setItem('role',  data.role);
      toast.success(`Welcome back, ${data.name}! 🎯`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
            <BrandLogo />
            <h1 style={{ margin: 0 }}>Smart Team</h1>
          </div>
          <p>AI-Powered Team Task Manager</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ paddingRight: '44px' }}
              />
              <button type="button" onClick={() => setShowPw(p => !p)}
                style={{ position: 'absolute', right: '12px', top: '50%',
                         transform: 'translateY(-50%)', background: 'none', color: 'var(--text-secondary)' }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={loading}
            style={{ justifyContent: 'center', padding: '13px', marginTop: 4 }}
          >
            {loading ? <span className="spinner" /> : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
