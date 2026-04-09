import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiMail, FiArrowRight } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSent(true);
        toast.success('OTP sent to your email!');
        setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 1500);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span className="logo" style={{ fontSize: '2rem' }}>TalentCo</span>
        </div>
        <h1 className="auth-title">Forgot Password?</h1>
        <p className="auth-subtitle">Enter your email and we'll send you a reset OTP</p>

        {sent ? (
          <div className="alert alert-success" style={{ textAlign: 'center' }}>
            ✅ OTP sent! Redirecting to reset page...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-control" style={{ paddingLeft: '42px' }}
                  type="email" placeholder="Registered email address"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending OTP...' : <><span>Send Reset OTP</span><FiArrowRight /></>}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
