import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiStar, FiBriefcase, FiShield, FiArrowRight, FiCheck, FiUsers, FiAward } from 'react-icons/fi';

const FEATURES = [
  { icon: <FiSearch size={24} />, title: 'Find Top Talent', desc: 'Search professionals by skill, category, or location with powerful filters.' },
  { icon: <FiBriefcase size={24} />, title: 'Send Hire Requests', desc: 'Connect directly with professionals and send personalized project requests.' },
  { icon: <FiStar size={24} />, title: 'Verified Reviews', desc: 'Make informed decisions with real ratings and honest client reviews.' },
  { icon: <FiShield size={24} />, title: 'Secure & Trusted', desc: 'All professionals are verified. Your data and payments are fully protected.' },
];

const CATEGORIES = ['Web Development', 'Design', 'Marketing', 'Consulting', 'Writing', 'Finance', 'Engineering', 'Photography'];

const STATS = [
  { number: '10K+', label: 'Professionals' },
  { number: '50K+', label: 'Clients Served' },
  { number: '98%', label: 'Satisfaction Rate' },
  { number: '150+', label: 'Categories' },
];

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: '64px' }}>
      {/* HERO */}
      <section style={{
        minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px',
        background: 'var(--gradient-hero)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(59,130,246,0.1) 0%, transparent 60%)'
        }} />
        <div style={{ maxWidth: '800px', position: 'relative' }} className="fade-in">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '999px', padding: '6px 16px', marginBottom: '24px',
            fontSize: '0.8rem', color: 'var(--accent-purple-light)', fontWeight: '600'
          }}>
            <FiAward size={12} /> Trusted by 50,000+ clients worldwide
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '900', lineHeight: '1.1',
            marginBottom: '24px', fontFamily: 'Outfit, sans-serif'
          }}>
            Hire the Right{' '}
            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Professional
            </span>{' '}
            for Every Need
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            TalentCo connects you with verified professionals across hundreds of categories. Post your needs, compare profiles, and hire with confidence.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/professionals" className="btn btn-primary btn-lg">
              <FiSearch size={18} /> Browse Professionals <FiArrowRight />
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Join as Professional
              </Link>
            )}
            {user && (
              <Link to={user.role === 'PROFESSIONAL' ? '/professional/dashboard' : '/client/dashboard'} className="btn btn-secondary btn-lg">
                Go to Dashboard
              </Link>
            )}
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '64px', flexWrap: 'wrap' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.number}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>
              Browse by <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Category</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Find specialized professionals in any domain</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {CATEGORIES.map((cat, i) => (
              <button key={i} onClick={() => navigate(`/professionals?category=${encodeURIComponent(cat)}`)}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '999px', padding: '12px 24px', color: 'var(--text-primary)',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', fontFamily: 'Inter, sans-serif',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-purple)'; e.target.style.color = 'var(--accent-purple-light)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-primary)'; }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>How It Works</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Get started in three simple steps</p>
          </div>
          <div className="grid-3">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up as a client or professional. Verify your email with OTP.' },
              { step: '02', title: 'Find & Connect', desc: 'Browse professional profiles, compare skills, and send a hiring request.' },
              { step: '03', title: 'Work & Review', desc: 'Professional accepts your request, you collaborate, then leave a review.' },
            ].map((item, i) => (
              <div key={i} className="card card-glow fade-in" style={{ textAlign: 'center', padding: '36px 28px' }}>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'rgba(124,58,237,0.3)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>{item.step}</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>
              Why Choose <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>TalentCo</span>
            </h2>
          </div>
          <div className="grid-2" style={{ gap: '20px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card card-glow" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(124,58,237,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple-light)', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div className="page-container" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>
            Ready to Get Started?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', fontSize: '1.1rem' }}>
            Join thousands of clients and professionals on TalentCo today.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account <FiArrowRight /></Link>
            <Link to="/professionals" className="btn btn-secondary btn-lg">Browse Professionals</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center' }}>
        <span className="logo">TalentCo</span>
        <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '0.85rem' }}>
          © 2024 TalentCo. Connecting talent with opportunity.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
