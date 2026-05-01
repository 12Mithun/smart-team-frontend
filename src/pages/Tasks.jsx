import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const STATUS_LABELS = { TODO: '📋 To Do', IN_PROGRESS: '⚙️ In Progress', DONE: '✅ Done' };
const STATUS_BADGE = { TODO: 'badge-todo', IN_PROGRESS: 'badge-progress', DONE: 'badge-done' };
const PRIORITY_BADGE = { HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low' };

export default function Tasks() {
  const [tasks, setTasks]         = useState([]);
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', status: 'TODO',
    priority: 'MEDIUM', deadline: '', projectId: '', assignedToId: '',
  });
  const role = localStorage.getItem('role');

  const fetchAll = async () => {
    const [t, p] = await Promise.all([api.get('/tasks'), api.get('/projects')]);
    setTasks(t.data);
    setProjects(p.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        projectId:    form.projectId    ? Number(form.projectId)    : null,
        assignedToId: form.assignedToId ? Number(form.assignedToId) : null,
        deadline:     form.deadline     || null,
      };
      await api.post('/tasks', payload);
      toast.success('Task created! ✅');
      setShowModal(false);
      setForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', deadline: '', projectId: '', assignedToId: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create task');
    } finally { setSaving(false); }
  };

  const updateStatus = async (task, newStatus) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        title: task.title, description: task.description,
        status: newStatus, priority: task.priority,
        deadline: task.deadline,
        projectId: task.project?.id || null,
        assignedToId: task.assignedTo?.id || null,
      });
      toast.success('Status updated');
      fetchAll();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${id}`); toast.success('Task deleted'); fetchAll(); }
    catch { toast.error('Delete failed'); }
  };

  const cols = STATUSES.map(s => ({ status: s, tasks: tasks.filter(t => t.status === s) }));

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">✅ Tasks</h2>
          <p className="page-subtitle">Kanban board — drag tasks across columns to update status</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Task
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" style={{ width: 36, height: 36 }} /></div>
      ) : (
        <div className="kanban-board">
          {cols.map(({ status, tasks }) => (
            <div className="kanban-col" key={status}>
              <div className="kanban-col-header">
                {STATUS_LABELS[status]}
                <span className="kanban-col-count">{tasks.length}</span>
              </div>
              {tasks.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '20px 0' }}>
                  No tasks here
                </p>
              )}
              {tasks.map(task => (
                <div className="task-card" key={task.id}>
                  <p className="task-card-title">{task.title}</p>
                  {task.description && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.4 }}>
                      {task.description.length > 80 ? task.description.substring(0, 80) + '...' : task.description}
                    </p>
                  )}
                  <div className="task-card-meta">
                    <span className={`badge ${PRIORITY_BADGE[task.priority] || 'badge-medium'}`}>
                      {task.priority}
                    </span>
                    {task.deadline && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={11} /> {task.deadline}
                      </span>
                    )}
                  </div>
                  {task.assignedTo && (
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                      👤 {task.assignedTo.name}
                    </p>
                  )}
                  {/* Quick Status Move */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                    {STATUSES.filter(s => s !== status).map(s => (
                      <button key={s} onClick={() => updateStatus(task, s)}
                        style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: 6,
                          background: 'rgba(108,99,255,0.1)', color: 'var(--accent-light)',
                          border: '1px solid rgba(108,99,255,0.2)', cursor: 'pointer' }}>
                        → {s.replace('_', ' ')}
                      </button>
                    ))}
                    {role === 'ADMIN' && (
                      <button onClick={() => handleDelete(task.id)}
                        style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: 6,
                          background: 'rgba(239,68,68,0.1)', color: 'var(--danger)',
                          border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Task</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Task Title *</label>
                  <input className="form-input" value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Implement login API" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Task details..." />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-input" value={form.status}
                      onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-input" value={form.priority}
                      onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input className="form-input" type="date" value={form.deadline}
                      onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project</label>
                    <select className="form-input" value={form.projectId}
                      onChange={e => setForm(p => ({ ...p, projectId: e.target.value }))}>
                      <option value="">No Project</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" /> : <><Plus size={16} /> Create Task</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
