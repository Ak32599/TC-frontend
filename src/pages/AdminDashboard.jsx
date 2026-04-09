import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiUsers, FiBriefcase, FiCheck, FiX, FiTrash2, FiRefreshCw, FiShield, FiActivity } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, requestsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/requests'),
      ]);
      setStats(statsRes.data || {});
      setUsers(usersRes.data || []);
      setRequests(requestsRes.data || []);
    } catch { toast.error('Failed to load admin data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role });
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
      }
    } catch { toast.error('Failed to update role.'); }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !u.active } : u));
      }
    } catch { toast.error('Failed to update status.'); }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) { toast.success('User deleted.'); setUsers(prev => prev.filter(u => u.id !== userId)); }
    } catch { toast.error('Failed to delete user.'); }
  };

  const filteredUsers = roleFilter === 'ALL' ? users : users.filter(u => u.role === roleFilter);

  const STAT_CARDS = [
    { label: 'Total Users', value: stats.totalUsers || 0, color: 'var(--accent-purple-light)', icon: <FiUsers /> },
    { label: 'Professionals', value: stats.totalProfessionals || 0, color: 'var(--accent-blue)', icon: <FiBriefcase /> },
    { label: 'Clients', value: stats.totalClients || 0, color: 'var(--accent-cyan)', icon: <FiUsers /> },
    { label: 'Total Requests', value: stats.totalRequests || 0, color: 'var(--accent-orange)', icon: <FiActivity /> },
    { label: 'Pending', value: stats.pendingRequests || 0, color: 'var(--accent-orange)', icon: <FiActivity /> },
    { label: 'Accepted', value: stats.acceptedRequests || 0, color: 'var(--accent-green)', icon: <FiCheck /> },
    { label: 'Rejected', value: stats.rejectedRequests || 0, color: 'var(--accent-red)', icon: <FiX /> },
  ];

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh' }}>
      <div className="page-container" style={{ paddingTop: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiShield color="var(--accent-purple-light)" /> Admin Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Manage users, roles, and platform activity</p>
          </div>
          <button onClick={fetchData} className="btn btn-secondary btn-sm"><FiRefreshCw size={13} /> Refresh</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: 'fit-content', flexWrap: 'wrap' }}>
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
            {/* OVERVIEW TAB */}
            {tab === 'overview' && (
              <div className="fade-in">
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                  {STAT_CARDS.map((s, i) => (
                    <div key={i} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
                      <div style={{ color: s.color, marginBottom: '6px' }}>{s.icon}</div>
                      <div className="stat-number" style={{ color: s.color, fontSize: '1.8rem' }}>{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Request Status Breakdown */}
                <div className="card" style={{ marginTop: '24px' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Request Status Breakdown</h2>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Pending', count: stats.pendingRequests || 0, color: 'var(--accent-orange)', cls: 'badge-pending' },
                      { label: 'Accepted', count: stats.acceptedRequests || 0, color: 'var(--accent-green)', cls: 'badge-accepted' },
                      { label: 'Rejected', count: stats.rejectedRequests || 0, color: 'var(--accent-red)', cls: 'badge-rejected' },
                    ].map((item, i) => (
                      <div key={i} style={{ flex: 1, minWidth: '140px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: item.color, fontFamily: 'Outfit, sans-serif' }}>{item.count}</div>
                        <span className={`badge ${item.cls}`} style={{ marginTop: '8px' }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {tab === 'users' && (
              <div className="fade-in">
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {['ALL', 'ADMIN', 'PROFESSIONAL', 'CLIENT', 'SUPPORT'].map(r => (
                    <button key={r} onClick={() => setRoleFilter(r)} className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-secondary'}`}>
                      {r} {r !== 'ALL' && `(${users.filter(u => u.role === r).length})`}
                    </button>
                  ))}
                </div>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id}>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{u.id}</td>
                          <td style={{ fontWeight: '600' }}>{u.name}</td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.email}</td>
                          <td>
                            <select
                              value={u.role}
                              onChange={e => handleRoleChange(u.id, e.target.value)}
                              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                              {['ADMIN', 'PROFESSIONAL', 'CLIENT', 'SUPPORT'].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </td>
                          <td>
                            <span className={`badge ${u.verified ? 'badge-accepted' : 'badge-rejected'}`}>
                              {u.verified ? '✓ Yes' : '✗ No'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${u.active ? 'badge-accepted' : 'badge-rejected'}`}>
                              {u.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => handleToggleStatus(u.id)} className="btn btn-secondary btn-sm" title={u.active ? 'Deactivate' : 'Activate'} style={{ padding: '5px 10px' }}>
                                {u.active ? <FiX size={12} /> : <FiCheck size={12} />}
                              </button>
                              <button onClick={() => handleDeleteUser(u.id, u.name)} className="btn btn-danger btn-sm" style={{ padding: '5px 10px' }}>
                                <FiTrash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && <div className="empty-state" style={{ padding: '40px' }}><div className="empty-state-title">No users found</div></div>}
                </div>
              </div>
            )}

            {/* REQUESTS TAB */}
            {tab === 'requests' && (
              <div className="fade-in">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Project</th><th>Client</th><th>Professional</th><th>Budget</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {requests.map(req => (
                        <tr key={req.id}>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{req.id}</td>
                          <td style={{ fontWeight: '600', maxWidth: '160px' }}>{req.projectTitle || 'Request'}</td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{req.client?.name}</td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{req.professional?.name}</td>
                          <td style={{ color: 'var(--accent-green)', fontWeight: '600' }}>{req.budget ? `$${req.budget}` : '-'}</td>
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

export default AdminDashboard;
