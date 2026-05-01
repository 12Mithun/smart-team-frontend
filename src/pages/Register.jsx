import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const BrandLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="14" fill="url(#regLogoGrad)"/>
    <circle cx="24" cy="24" r="13" stroke="white" strokeWidth="2.5" fill="none"/>
    <circle cx="24" cy="24" r="8"  stroke="white" strokeWidth="2.5" fill="none"/>
    <circle cx="24" cy="24" r="3"  fill="white"/>
    <line x1="24" y1="7"  x2="24" y2="11" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="24" y1="37" x2="24" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <defs>
      <linearGradient id="regLogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0ea5e9"/>
        <stop offset="1" stopColor="#67e8f9"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/signup', form);
      toast.success('Account created! Please sign in. 🎯');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
            <BrandLogo />
            <h1 style={{ margin: 0 }}>Smart Team</h1>
          </div>
          <p>Create your account to get started</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" name="name"
              placeholder="Your full name" value={form.name}
              onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" name="email"
              placeholder="you@company.com" value={form.email}
              onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password"
              placeholder="Min 6 characters" value={form.password}
              onChange={handleChange} required minLength={6} />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-input" name="role" value={form.role} onChange={handleChange}>
              <option value="MEMBER">👤 Team Member</option>
              <option value="ADMIN">🛡️ Admin</option>
            </select>
          </div>

          <button className="btn btn-primary w-full" type="submit" disabled={loading}
            style={{ justifyContent: 'center', padding: '13px', marginTop: 4 }}>
            {loading ? <span className="spinner" /> : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
