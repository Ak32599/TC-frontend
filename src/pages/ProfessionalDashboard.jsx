import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FiUser, FiBriefcase, FiStar, FiArrowRight, FiEdit, FiInbox } from 'react-icons/fi';

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/professionals/my-profile').catch(() => ({ data: null })),
      api.get('/requests/professional').catch(() => ({ data: [] }))
    ]).then(([p, r]) => {
      setProfile(p.data?.success === false ? null : p.data);
      setRequests(r.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const pending = requests.filter(r => r.status === 'PENDING').length;
  const accepted = requests.filter(r => r.status === 'ACCEPTED').length;
  const recent = requests.slice(0, 5);

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh' }}>
      <div className="page-container" style={{ paddingTop: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
              Hello, <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Manage your profile and respond to hiring requests</p>
          </div>
          <Link to="/professional/profile" className="btn btn-primary"><FiEdit size={14} /> Manage Profile</Link>
        </div>

        {/* Profile incomplete banner */}
        {!loading && !profile && (
          <div className="alert alert-info" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ Complete your profile so clients can find and hire you!</span>
            <Link to="/professional/profile" className="btn btn-primary btn-sm">Setup Profile</Link>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          {[
            { label: 'Total Requests', value: requests.length, color: 'var(--accent-purple-light)', icon: <FiInbox /> },
            { label: 'Pending', value: pending, color: 'var(--accent-orange)', icon: <FiBriefcase /> },
            { label: 'Accepted', value: accepted, color: 'var(--accent-green)', icon: <FiStar /> },
            { label: 'Avg Rating', value: profile?.averageRating ? profile.averageRating.toFixed(1) : 'N/A', color: 'var(--accent-orange)', icon: <FiStar /> },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
              <div style={{ color: s.color, marginBottom: '8px' }}>{s.icon}</div>
              <div className="stat-number" style={{ color: s.color, fontSize: '1.6rem' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: '24px' }}>
          {/* Profile snapshot */}
          <div className="card">
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Your Profile</h2>
            {profile ? (
              <div>
                {profile.category && <div style={{ marginBottom: '10px' }}><span className="badge badge-professional">{profile.category}</span></div>}
                {profile.bio && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px', lineHeight: '1.6' }}>{profile.bio?.slice(0, 120)}...</p>}
                {profile.skills && (
                  <div className="pro-skills" style={{ marginBottom: '12px' }}>
                    {profile.skills.split(',').slice(0, 5).map((s, i) => <span key={i} className="skill-tag">{s.trim()}</span>)}
                  </div>
                )}
                {profile.hourlyRate && <div style={{ color: 'var(--accent-green)', fontWeight: '700', marginBottom: '16px' }}>${profile.hourlyRate}/hr</div>}
                <Link to="/professional/profile" className="btn btn-secondary btn-sm"><FiEdit size={13} /> Edit Profile</Link>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '24px' }}>
                <div className="empty-state-icon">👤</div>
                <div className="empty-state-title">No profile yet</div>
                <Link to="/professional/profile" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>Create Profile</Link>
              </div>
            )}
          </div>

          {/* Recent Requests */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Incoming Requests</h2>
              <Link to="/professional/requests" style={{ fontSize: '0.85rem', color: 'var(--accent-purple-light)', textDecoration: 'none' }}>View all →</Link>
            </div>
            {loading ? <div className="spinner" style={{ width: '32px', height: '32px' }} /> :
              recent.length === 0 ? (
                <div className="empty-state" style={{ padding: '24px' }}>
                  <div className="empty-state-icon">📬</div>
                  <div className="empty-state-title">No requests yet</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Complete your profile to get hired</p>
                </div>
              ) : recent.map(req => (
                <div key={req.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{req.projectTitle || 'Request'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>From: {req.client?.name}</div>
                  </div>
                  <span className={`badge badge-${req.status?.toLowerCase()}`}>{req.status}</span>
                </div>
              ))
            }
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Quick Actions</h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { title: 'Edit Profile', desc: 'Update your skills and bio', link: '/professional/profile', icon: <FiUser size={18} />, color: 'var(--accent-purple)' },
                { title: 'Manage Requests', desc: 'Accept or reject client requests', link: '/professional/requests', icon: <FiInbox size={18} />, color: 'var(--accent-blue)' },
              ].map((a, i) => (
                <Link key={i} to={a.link} style={{ textDecoration: 'none', flex: '1', minWidth: '220px' }}>
                  <div className="card" style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', height: '100%' }}>
                    <div style={{ width: '44px', height: '44px', background: `${a.color}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color, flexShrink: 0 }}>{a.icon}</div>
                    <div><div style={{ fontWeight: '600' }}>{a.title}</div><div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{a.desc}</div></div>
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

export default ProfessionalDashboard;
