import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiMail, FiRefreshCw } from 'react-icons/fi';

const OtpVerify = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) { toast.error('Please enter the complete 6-digit OTP.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp: otpString });
      if (res.data.success) {
        toast.success('Email verified! You can now login.');
        navigate('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await api.post('/auth/resend-otp', { email });
      if (res.data.success) {
        toast.success('New OTP sent to your email!');
        setCountdown(60);
        setOtp(['', '', '', '', '', '']);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(124,58,237,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FiMail size={28} color="var(--accent-purple-light)" />
          </div>
          <span className="logo" style={{ fontSize: '1.5rem' }}>TalentCo</span>
        </div>
        <h1 className="auth-title">Verify Your Email</h1>
        <p className="auth-subtitle">
          We sent a 6-digit OTP to<br />
          <strong style={{ color: 'var(--accent-purple-light)' }}>{email}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="otp-inputs" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                className="otp-input"
                type="text" inputMode="numeric"
                maxLength={1} value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Didn't receive it?{' '}
          {countdown > 0 ? (
            <span style={{ color: 'var(--text-muted)' }}>Resend in {countdown}s</span>
          ) : (
            <button onClick={handleResend} disabled={resending}
              style={{ background: 'none', border: 'none', color: 'var(--accent-purple-light)', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <FiRefreshCw size={13} /> {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
        </div>

        <div className="auth-footer">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
