import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const ROLES = [
  { value: 'CLIENT', label: '🧑 Client – Hire Professionals' },
  { value: 'PROFESSIONAL', label: '💼 Professional – Offer Services' },
  { value: 'SUPPORT', label: '🎧 Customer Support' },
];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CLIENT' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      if (res.data.success) {
        toast.success('Registration successful! Check your email for OTP.');
        navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
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
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join TalentCo and connect with top professionals</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-control" style={{ paddingLeft: '42px' }}
                type="text" name="name" placeholder="Your full name"
                value={form.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-control" style={{ paddingLeft: '42px' }}
                type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-control" style={{ paddingLeft: '42px' }}
                type="password" name="password" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>I want to join as</label>
            <select className="form-control" name="role" value={form.role} onChange={handleChange}>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : <><span>Create Account</span><FiArrowRight /></>}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
