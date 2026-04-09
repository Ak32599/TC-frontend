import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiClock, FiRefreshCw, FiUser, FiDollarSign } from 'react-icons/fi';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [rejecting, setRejecting] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try { const res = await api.get('/requests/professional'); setRequests(res.data || []); }
    catch { toast.error('Failed to load requests.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAccept = async (id) => {
    setProcessing(id);
    try {
      const res = await api.put(`/requests/${id}/accept`);
      if (res.data.success) { toast.success('Request accepted!'); setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r)); }
      else toast.error(res.data.message);
    } catch { toast.error('Failed to accept request.'); }
    finally { setProcessing(null); }
  };

  const handleReject = async (id) => {
    setProcessing(id);
    try {
      const res = await api.put(`/requests/${id}/reject`, { reason: rejectReason });
      if (res.data.success) { toast.success('Request rejected.'); setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', rejectionReason: rejectReason } : r)); setRejecting(null); setRejectReason(''); }
      else toast.error(res.data.message);
    } catch { toast.error('Failed to reject request.'); }
    finally { setProcessing(null); }
  };

  const filtered = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh' }}>
      <div className="page-container" style={{ paddingTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1 className="page-title">Hiring Requests</h1>
            <p className="page-subtitle">Review, accept or reject client requests</p>
          </div>
          <button onClick={fetchRequests} className="btn btn-secondary btn-sm"><FiRefreshCw size={13} /> Refresh</button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>
              {f === 'PENDING' && <FiClock size={12} />}
              {f === 'ACCEPTED' && <FiCheck size={12} />}
              {f === 'REJECTED' && <FiX size={12} />}
              {f} {f !== 'ALL' && `(${requests.filter(r => r.status === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /><p className="loading-text">Loading requests...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📬</div>
            <div className="empty-state-title">No {filter !== 'ALL' ? filter.toLowerCase() : ''} requests</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Complete your profile to attract more clients</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map(req => (
              <div key={req.id} className="card card-glow fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontWeight: '800', fontSize: '1.05rem' }}>{req.projectTitle || 'Hiring Request'}</h3>
                      <span className={`badge badge-${req.status?.toLowerCase()}`}>{req.status}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '10px' }}>
                      <FiUser size={13} /> From: <strong style={{ color: 'var(--text-primary)' }}>{req.client?.name}</strong>
                    </div>
                    {req.message && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '10px' }}>{req.message}</p>}
                    {req.budget && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontWeight: '700', fontSize: '1rem', marginBottom: '10px' }}>
                        <FiDollarSign size={14} /> Budget: ${req.budget}
                      </div>
                    )}
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {req.createdAt ? new Date(req.createdAt).toLocaleString() : ''}
                    </div>
                  </div>

                  {req.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexDirection: 'column', alignItems: 'flex-end' }}>
                      <button onClick={() => handleAccept(req.id)} className="btn btn-success btn-sm" disabled={processing === req.id}>
                        <FiCheck size={13} /> {processing === req.id ? '...' : 'Accept'}
                      </button>
                      {rejecting === req.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
                          <textarea className="form-control" rows={2} placeholder="Reason for rejection (optional)" value={rejectReason} onChange={e => setRejectReason(e.target.value)} style={{ fontSize: '0.85rem' }} />
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleReject(req.id)} className="btn btn-danger btn-sm" disabled={processing === req.id}><FiX size={12} /> Confirm</button>
                            <button onClick={() => { setRejecting(null); setRejectReason(''); }} className="btn btn-secondary btn-sm">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setRejecting(req.id)} className="btn btn-danger btn-sm">
                          <FiX size={13} /> Reject
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRequests;
