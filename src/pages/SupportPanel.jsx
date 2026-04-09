import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiHeadphones, FiUsers, FiBriefcase, FiRefreshCw, FiActivity } from 'react-icons/fi';

const SupportPanel = () => {
  const [overview, setOverview] = useState({});
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ovRes, usersRes, reqRes] = await Promise.all([
        api.get('/support/overview'),
        api.get('/support/users'),
        api.get('/support/requests'),
      ]);
      setOverview(ovRes.data || {});
      setUsers(usersRes.data || []);
      setRequests(reqRes.data || []);
    } catch { toast.error('Failed to load support data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh' }}>
      <div className="page-container" style={{ paddingTop: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiHeadphones color="var(--accent-pink)" /> Support Panel
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Monitor users and resolve platform issues</p>
          </div>
          <button onClick={fetchData} className="btn btn-secondary btn-sm"><FiRefreshCw size={13} /> Refresh</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: 'fit-content' }}>
          {['overview', 'users', 'requests'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-secondary'}`} style={{ border: 'none', textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /><p className="loading-text">Loading...</p></div>
        ) : (
          <>
            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="fade-in">
                <div className="stats-grid">
                  {[
                    { label: 'Total Users', value: overview.totalUsers || 0, color: 'var(--accent-purple-light)', icon: <FiUsers /> },
                    { label: 'Active Users', value: overview.activeUsers || 0, color: 'var(--accent-green)', icon: <FiUsers /> },
                    { label: 'Inactive Users', value: overview.inactiveUsers || 0, color: 'var(--accent-red)', icon: <FiUsers /> },
                    { label: 'Total Requests', value: overview.totalRequests || 0, color: 'var(--accent-blue)', icon: <FiActivity /> },
                  ].map((s, i) => (
                    <div key={i} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
                      <div style={{ color: s.color, marginBottom: '6px' }}>{s.icon}</div>
                      <div className="stat-number" style={{ color: s.color, fontSize: '1.8rem' }}>{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ marginTop: '24px' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Support Guidelines</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { emoji: '👥', title: 'Monitor Users', desc: 'View all registered users and their account status.' },
                      { emoji: '📋', title: 'Track Requests', desc: 'Monitor all hiring requests between clients and professionals.' },
                      { emoji: '⚠️', title: 'Report Issues', desc: 'Escalate critical issues to the admin team for resolution.' },
                      { emoji: '💬', title: 'Assist Users', desc: 'Help users navigate the platform via external support channels.' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '1.5rem' }}>{item.emoji}</div>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '2px' }}>{item.title}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* USERS */}
            {tab === 'users' && (
              <div className="fade-in">
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>
                  {users.length} total users on the platform
                </p>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{u.id}</td>
                          <td style={{ fontWeight: '600' }}>{u.name}</td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.email}</td>
                          <td>
                            <span className={`badge badge-${u.role?.toLowerCase()}`}>{u.role}</span>
                          </td>
                          <td>
                            <span className={`badge ${u.verified ? 'badge-accepted' : 'badge-rejected'}`}>
                              {u.verified ? '✓ Verified' : '✗ Pending'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${u.active ? 'badge-accepted' : 'badge-rejected'}`}>
                              {u.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && <div className="empty-state" style={{ padding: '40px' }}><div className="empty-state-title">No users found</div></div>}
                </div>
              </div>
            )}

            {/* REQUESTS */}
            {tab === 'requests' && (
              <div className="fade-in">
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>
                  {requests.length} total hiring requests
                </p>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Project</th><th>Client</th><th>Professional</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {requests.map(req => (
                        <tr key={req.id}>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{req.id}</td>
                          <td style={{ fontWeight: '600' }}>{req.projectTitle || 'Request'}</td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{req.client?.name}</td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{req.professional?.name}</td>
                          <td><span className={`badge badge-${req.status?.toLowerCase()}`}>{req.status}</span></td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {requests.length === 0 && <div className="empty-state" style={{ padding: '40px' }}><div className="empty-state-title">No requests yet</div></div>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SupportPanel;
