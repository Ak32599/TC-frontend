import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiStar, FiMapPin, FiClock, FiDollarSign, FiArrowLeft, FiSend } from 'react-icons/fi';

const ProfessionalProfile = () => {
  const { id } = useParams();
  const { user, isClient } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ projectTitle: '', message: '', budget: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, feedbackRes] = await Promise.all([
          api.get(`/professionals/${id}`),
          api.get(`/feedback/professional/${id}`)
        ]);
        setProfile(profileRes.data);
        setFeedbacks(feedbackRes.data || []);
        if (profileRes.data?.user?.id) {
          const svcRes = await api.get(`/professionals/user/${profileRes.data.user.id}/services`);
          setServices(svcRes.data || []);
        }
      } catch { toast.error('Failed to load profile.'); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [id]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      const res = await api.post('/requests', { ...requestForm, professionalId: profile.user.id, budget: parseFloat(requestForm.budget) || null });
      if (res.data.success) { toast.success('Hiring request sent!'); setShowModal(false); setRequestForm({ projectTitle: '', message: '', budget: '' }); }
      else toast.error(res.data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send request.'); }
    finally { setSubmitting(false); }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/feedback', { professionalId: profile.user.id, ...feedbackForm });
      if (res.data.success) { toast.success('Feedback submitted!'); setShowFeedback(false); }
      else toast.error(res.data.message);
    } catch { toast.error('Failed to submit feedback.'); }
  };

  if (loading) return <div style={{ paddingTop: '88px' }} className="loading-wrapper"><div className="spinner" /></div>;
  if (!profile) return <div style={{ paddingTop: '88px', textAlign: 'center', padding: '120px 24px' }}><h2>Profile not found</h2><button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button></div>;

  const skillList = profile.skills ? profile.skills.split(',').map(s => s.trim()) : [];
  const initials = profile.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="page-container" style={{ paddingTop: '24px', maxWidth: '900px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '24px' }}>
          <FiArrowLeft /> Back
        </button>

        {/* Profile Header */}
        <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(124,58,237,0.05) 100%)' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: '96px', height: '96px', background: 'var(--gradient-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '700', color: '#fff', flexShrink: 0 }}>{initials}</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '4px' }}>{profile.user?.name}</h1>
              {profile.category && <div style={{ color: 'var(--accent-purple-light)', fontWeight: '600', marginBottom: '12px' }}>{profile.category}</div>}
              {profile.bio && <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '16px' }}>{profile.bio}</p>}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {profile.location && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}><FiMapPin size={14} />{profile.location}</span>}
                {profile.availability && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}><FiClock size={14} />{profile.availability}</span>}
                {profile.hourlyRate && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontWeight: '700' }}><FiDollarSign size={14} />${profile.hourlyRate}/hr</span>}
                {profile.averageRating > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-orange)' }}><FiStar size={14} />{profile.averageRating?.toFixed(1)} ({profile.totalReviews} reviews)</span>}
              </div>
            </div>
            {isClient() && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <FiSend size={14} /> Hire Now
              </button>
            )}
          </div>
        </div>

        <div className="grid-2" style={{ gap: '24px' }}>
          {/* Skills */}
          {skillList.length > 0 && (
            <div className="card">
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Skills & Expertise</h2>
              <div className="pro-skills">{skillList.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}</div>
            </div>
          )}

          {/* Services */}
          {services.length > 0 && (
            <div className="card">
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Services Offered</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {services.map(s => (
                  <div key={s.id} style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{s.title}</div>
                    {s.description && <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>{s.description}</div>}
                    {s.price && <div style={{ color: 'var(--accent-green)', fontWeight: '700', marginTop: '8px' }}>${s.price}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="card" style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Client Reviews ({feedbacks.length})</h2>
            {isClient() && <button className="btn btn-secondary btn-sm" onClick={() => setShowFeedback(!showFeedback)}>Leave Review</button>}
          </div>
          {showFeedback && (
            <form onSubmit={handleFeedback} style={{ marginBottom: '24px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <select className="form-control" value={feedbackForm.rating} onChange={e => setFeedbackForm({ ...feedbackForm, rating: parseInt(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{'⭐'.repeat(r)} {r} Star{r !== 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea className="form-control" placeholder="Share your experience..." value={feedbackForm.comment} onChange={e => setFeedbackForm({ ...feedbackForm, comment: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">Submit Review</button>
            </form>
          )}
          {feedbacks.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px' }}><div className="empty-state-icon">💬</div><div className="empty-state-title">No reviews yet</div></div>
          ) : feedbacks.map(fb => (
            <div key={fb.id} style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600' }}>{fb.client?.name}</span>
                <span style={{ color: 'var(--accent-orange)' }}>{'⭐'.repeat(fb.rating)}</span>
              </div>
              {fb.comment && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{fb.comment}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Hire Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', border: '1px solid var(--border-light)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>Send Hiring Request</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>to {profile.user?.name}</p>
            <form onSubmit={handleSendRequest}>
              <div className="form-group"><label>Project Title</label><input className="form-control" type="text" placeholder="e.g. Build my website" value={requestForm.projectTitle} onChange={e => setRequestForm({ ...requestForm, projectTitle: e.target.value })} required /></div>
              <div className="form-group"><label>Message</label><textarea className="form-control" placeholder="Describe your project requirements..." value={requestForm.message} onChange={e => setRequestForm({ ...requestForm, message: e.target.value })} required /></div>
              <div className="form-group"><label>Budget (USD, optional)</label><input className="form-control" type="number" placeholder="e.g. 500" value={requestForm.budget} onChange={e => setRequestForm({ ...requestForm, budget: e.target.value })} /></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1 }}>{submitting ? 'Sending...' : 'Send Request'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalProfile;
