import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Sparkles, LogOut } from 'lucide-react';

const navItems = [
  { to: '/',         icon: <LayoutDashboard size={18} />, label: 'Dashboard'    },
  { to: '/projects', icon: <FolderKanban size={18} />,   label: 'Projects'     },
  { to: '/tasks',    icon: <CheckSquare size={18} />,    label: 'Tasks'        },
  { to: '/ai',       icon: <Sparkles size={18} />,       label: 'AI Assistant' },
];

export default function Layout() {
  const navigate = useNavigate();
  const name  = localStorage.getItem('name')  || 'User';
  const role  = localStorage.getItem('role')  || '';

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">

        {/* Logo */}
        <div className="sidebar-logo">
          {/* Custom SVG logo — unique target/team icon */}
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="34" height="34" rx="9" fill="url(#logoGrad)"/>
            <circle cx="17" cy="17" r="9" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="17" cy="17" r="5" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="17" cy="17" r="2" fill="white"/>
            <line x1="17" y1="4" x2="17" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="17" y1="26" x2="17" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5e9"/>
                <stop offset="1" stopColor="#67e8f9"/>
              </linearGradient>
            </defs>
          </svg>
          <h1>Smart Team</h1>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-badge">
            <div className="avatar">{name.charAt(0).toUpperCase()}</div>
            <div className="user-info" style={{ flex: 1 }}>
              <p>{name}</p>
              <span style={{ color: 'var(--accent-light)', fontWeight: 600, fontSize: '0.7rem' }}>{role}</span>
            </div>
            <button onClick={logout} title="Logout"
              style={{ background: 'none', color: 'var(--text-secondary)', padding: '4px' }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
