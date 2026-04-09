import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FiSearch, FiBriefcase, FiClock, FiArrowRight, FiUser } from 'react-icons/fi';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/requests/client').then(r => setRequests(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const pending = requests.filter(r => r.status === 'PENDING').length;
  const accepted = requests.filter(r => r.status === 'ACCEPTED').length;
  const rejected = requests.filter(r => r.status === 'REJECTED').length;
  const recent = requests.slice(0, 5);

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh' }}>
      <div className="page-container" style={{ paddingTop: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
              Welcome back, <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Find professionals and manage your hiring requests</p>
          </div>
          <Link to="/professionals" className="btn btn-primary">
            <FiSearch size={14} /> Find Professionals <FiArrowRight size={14} />
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '32px' }}>
          {[
            { label: 'Total Requests', value: requests.length, color: 'var(--accent-purple-light)', icon: <FiBriefcase /> },
            { label: 'Pending', value: pending, color: 'var(--accent-orange)', icon: <FiClock /> },
            { label: 'Accepted', value: accepted, color: 'var(--accent-green)', icon: <FiUser /> },
            { label: 'Rejected', value: rejected, color: 'var(--accent-red)', icon: <FiUser /> },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
              <div style={{ color: s.color, marginBottom: '8px' }}>{s.icon}</div>
              <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: '24px' }}>
          {/* Recent Requests */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recent Requests</h2>
              <Link to="/client/requests" style={{ fontSize: '0.85rem', color: 'var(--accent-purple-light)', textDecoration: 'none' }}>View all →</Link>
            </div>
            {loading ? <div className="spinner" style={{ width: '32px', height: '32px' }} /> :
              recent.length === 0 ? (
                <div className="empty-state" style={{ padding: '24px' }}>
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-title">No requests yet</div>
                  <Link to="/professionals" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>Browse Professionals</Link>
                </div>
              ) : recent.map(req => (
                <div key={req.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{req.projectTitle || 'Hiring Request'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>To: {req.professional?.name}</div>
                  </div>
                  <span className={`badge badge-${req.status?.toLowerCase()}`}>{req.status}</span>
                </div>
              ))
            }
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <FiSearch size={18} />, title: 'Browse Professionals', desc: 'Search by skill, category or location', link: '/professionals', color: 'var(--accent-purple)' },
                { icon: <FiBriefcase size={18} />, title: 'My Requests', desc: 'Track all your hiring requests', link: '/client/requests', color: 'var(--accent-blue)' },
              ].map((action, i) => (
                <Link key={i} to={action.link} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer' }}>
                    <div style={{ width: '44px', height: '44px', background: `${action.color}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color }}>
                      {action.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{action.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>{action.desc}</div>
                    </div>
                    <FiArrowRight style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
