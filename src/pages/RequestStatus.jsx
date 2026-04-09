import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiClock, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';

const RequestStatus = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchRequests = async () => {
    setLoading(true);
    try { const res = await api.get('/requests/client'); setRequests(res.data || []); }
    catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const filtered = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);

  const statusIcon = { PENDING: <FiClock color="var(--accent-orange)" />, ACCEPTED: <FiCheck color="var(--accent-green)" />, REJECTED: <FiX color="var(--accent-red)" /> };

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh' }}>
      <div className="page-container" style={{ paddingTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1 className="page-title">My Requests</h1>
            <p className="page-subtitle">Track all your hiring requests</p>
          </div>
          <button onClick={fetchRequests} className="btn btn-secondary btn-sm"><FiRefreshCw size={13} /> Refresh</button>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>
              {f} {f !== 'ALL' && `(${requests.filter(r => r.status === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /><p className="loading-text">Loading requests...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">No {filter !== 'ALL' ? filter.toLowerCase() : ''} requests found</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map(req => (
              <div key={req.id} className="card card-glow fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      {statusIcon[req.status]}
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{req.projectTitle || 'Hiring Request'}</h3>
                      <span className={`badge badge-${req.status?.toLowerCase()}`}>{req.status}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
                      Professional: <strong style={{ color: 'var(--text-primary)' }}>{req.professional?.name}</strong>
                    </div>
                    {req.message && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '8px' }}>{req.message}</p>}
                    {req.rejectionReason && (
                      <div className="alert alert-error" style={{ margin: 0, fontSize: '0.85rem', padding: '8px 12px' }}>
                        Rejection reason: {req.rejectionReason}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {req.budget && <div style={{ fontWeight: '700', color: 'var(--accent-green)', fontSize: '1.1rem' }}>${req.budget}</div>}
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestStatus;
