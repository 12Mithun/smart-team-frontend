import { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
} from 'chart.js';
import { CheckCircle, Clock, ListTodo, FolderOpen, Users, TrendingUp } from 'lucide-react';
import api from '../api/axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const chartOptions = {
  plugins: { legend: { labels: { color: '#94a3b8', font: { size: 12 } } } },
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
  },
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem('name') || 'User';

  useEffect(() => {
    api.get('/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <span className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  const statCards = [
    { label: 'Total Tasks',    value: stats.totalTasks,    icon: <ListTodo size={22} />,   bg: 'rgba(108,99,255,0.15)', color: 'var(--accent)' },
    { label: 'Completed',      value: stats.completedTasks,icon: <CheckCircle size={22} />, bg: 'rgba(34,197,94,0.15)',  color: 'var(--success)' },
    { label: 'In Progress',    value: stats.inProgressTasks,icon:<Clock size={22} />,       bg: 'rgba(245,158,11,0.15)', color: 'var(--warning)' },
    { label: 'Total Projects', value: stats.totalProjects, icon: <FolderOpen size={22} />,  bg: 'rgba(239,68,68,0.15)', color: 'var(--danger)' },
    { label: 'Team Members',   value: stats.totalUsers,    icon: <Users size={22} />,       bg: 'rgba(108,99,255,0.15)', color: 'var(--accent-light)' },
    { label: 'Completion %',   value: `${stats.completionRate}%`, icon: <TrendingUp size={22} />, bg: 'rgba(34,197,94,0.15)', color: 'var(--success)' },
  ];

  const doughnutData = {
    labels: ['Done', 'In Progress', 'To Do'],
    datasets: [{
      data: [stats.completedTasks, stats.inProgressTasks, stats.todoTasks],
      backgroundColor: ['rgba(34,197,94,0.8)', 'rgba(245,158,11,0.8)', 'rgba(108,99,255,0.8)'],
      borderColor: ['#22c55e', '#f59e0b', '#6c63ff'],
      borderWidth: 2,
    }],
  };

  const barData = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [{
      label: 'Tasks',
      data: [stats.todoTasks, stats.inProgressTasks, stats.completedTasks],
      backgroundColor: ['rgba(108,99,255,0.7)', 'rgba(245,158,11,0.7)', 'rgba(34,197,94,0.7)'],
      borderRadius: 8,
    }],
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">👋 Welcome, {name}!</h2>
          <p className="page-subtitle">Here's your Smart Team overview for today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 20 }}>📊 Task Status Distribution</h3>
          <div style={{ maxWidth: 280, margin: '0 auto' }}>
            <Doughnut data={doughnutData} options={{ plugins: { legend: { labels: { color: '#94a3b8' } } } }} />
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 20 }}>📈 Task Overview</h3>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
