import { useState } from 'react';
import { Sparkles, FileText, Flag, Calendar, BookOpen, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const AI_TOOLS = [
  {
    id: 'description',
    icon: <FileText size={20} />,
    label: '📝 Task Description Generator',
    desc: 'Generate a professional task description from just a title',
    endpoint: (title) => `/ai/generate-description?title=${encodeURIComponent(title)}`,
    resultKey: 'description',
    placeholder: 'e.g. Implement JWT authentication',
    color: 'rgba(108,99,255,0.15)',
    accent: 'var(--accent)',
  },
  {
    id: 'priority',
    icon: <Flag size={20} />,
    label: '🚦 Priority Suggester',
    desc: 'AI recommends the right priority level for your task',
    endpoint: (title) => `/ai/suggest-priority?title=${encodeURIComponent(title)}`,
    resultKey: 'priority',
    placeholder: 'e.g. Fix login bug in production',
    color: 'rgba(245,158,11,0.15)',
    accent: 'var(--warning)',
  },
  {
    id: 'deadline',
    icon: <Calendar size={20} />,
    label: '📅 Smart Deadline Estimator',
    desc: 'Get a realistic deadline estimate for your task',
    endpoint: (title) => `/ai/estimate-deadline?title=${encodeURIComponent(title)}`,
    resultKey: 'deadline',
    placeholder: 'e.g. Build REST API for user management',
    color: 'rgba(34,197,94,0.15)',
    accent: 'var(--success)',
  },
  {
    id: 'summary',
    icon: <BookOpen size={20} />,
    label: '📊 Daily Summary Generator',
    desc: 'Get an AI-powered motivational summary of your day',
    endpoint: null,
    resultKey: 'summary',
    placeholder: null,
    color: 'rgba(239,68,68,0.15)',
    accent: 'var(--danger)',
    isSummary: true,
  },
];

function AiTool({ tool }) {
  const [input, setInput]   = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState({ userName: '', completed: 0, inProgress: 0, todo: 0 });

  const run = async () => {
    setLoading(true);
    setResult('');
    try {
      let endpoint;
      if (tool.isSummary) {
        const { userName, completed, inProgress, todo } = summaryData;
        endpoint = `/ai/daily-summary?userName=${encodeURIComponent(userName)}&completed=${completed}&inProgress=${inProgress}&todo=${todo}`;
      } else {
        if (!input.trim()) { toast.error('Please enter a task title'); setLoading(false); return; }
        endpoint = tool.endpoint(input);
      }
      const { data } = await api.get(endpoint);
      setResult(data[tool.resultKey]);
      toast.success('AI response ready! ✨');
    } catch (err) {
      toast.error(err.response?.data?.error || 'AI request failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="card" style={{ borderColor: tool.color }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: tool.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: tool.accent }}>
          {tool.icon}
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{tool.label}</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{tool.desc}</p>
        </div>
      </div>

      {tool.isSummary ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          <input className="form-input" placeholder="Your name"
            value={summaryData.userName}
            onChange={e => setSummaryData(p => ({ ...p, userName: e.target.value }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {['completed', 'inProgress', 'todo'].map(field => (
              <input key={field} className="form-input" type="number" min={0}
                placeholder={field} value={summaryData[field]}
                onChange={e => setSummaryData(p => ({ ...p, [field]: Number(e.target.value) }))} />
            ))}
          </div>
        </div>
      ) : (
        <input className="form-input" style={{ marginTop: 12 }}
          placeholder={tool.placeholder} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run()} />
      )}

      <button className="btn btn-primary" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
        onClick={run} disabled={loading}>
        {loading ? <><Loader size={16} className="spinning" /> Generating...</> : <><Sparkles size={16} /> Generate</>}
      </button>

      {result && (
        <div className="ai-result">
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AI Response
          </p>
          {result}
        </div>
      )}
    </div>
  );
}

export default function AIAssistant() {
  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">🤖 AI Assistant</h2>
          <p className="page-subtitle">Powered by OpenAI — Smart tools to boost your team's productivity</p>
        </div>
        <div style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)',
          borderRadius: 8, padding: '6px 14px', fontSize: '0.8rem', color: 'var(--accent-light)' }}>
          ⚡ AI Powered
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {AI_TOOLS.map(tool => <AiTool key={tool.id} tool={tool} />)}
      </div>
    </div>
  );
}
