import React, { useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) { toast.error('Enter the 6-digit OTP.'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email, otp: otpString, newPassword });
      if (res.data.success) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed.');
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
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Enter the OTP sent to <strong style={{ color: 'var(--accent-purple-light)' }}>{email}</strong></p>

        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((digit, i) => (
              <input key={i} ref={el => inputRefs.current[i] = el}
                className="otp-input" type="text" inputMode="numeric"
                maxLength={1} value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)} autoFocus={i === 0} />
            ))}
          </div>

          <div className="form-group">
            <label>New Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-control" style={{ paddingLeft: '42px', paddingRight: '42px' }}
                type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <div className="auth-footer"><Link to="/login">← Back to Login</Link></div>
      </div>
    </div>
  );
};

export default ResetPassword;
