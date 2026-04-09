import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiUser, FiHome, FiSearch, FiBriefcase, FiSettings } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAdmin, isProfessional } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (isAdmin()) return '/admin';
    if (isProfessional()) return '/professional/dashboard';
    if (user.role === 'SUPPORT') return '/support';
    return '/client/dashboard';
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)', padding: '0 24px', height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span className="logo">TalentCo</span>
      </Link>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!user ? (
          <>
            <Link to="/professionals" className="btn btn-secondary btn-sm">
              <FiSearch size={14} /> Browse Talent
            </Link>
            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        ) : (
          <>
            <Link to={getDashboardLink()} className="btn btn-secondary btn-sm">
              <FiHome size={14} /> Dashboard
            </Link>
            {user.role !== 'ADMIN' && user.role !== 'SUPPORT' && (
              <Link to="/professionals" className="btn btn-secondary btn-sm">
                <FiSearch size={14} /> Find Talent
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--bg-card)', padding: '6px 12px',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'
              }}>
                <div style={{
                  width: '28px', height: '28px', background: 'var(--gradient-primary)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: '700', color: '#fff'
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>{user.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
                <FiLogOut size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
