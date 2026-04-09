import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';

const ProfessionalCard = ({ profile, onHire }) => {
  const navigate = useNavigate();
  const { id, user, bio, skills, hourlyRate, location, category, averageRating, totalReviews, availability } = profile;

  const skillList = skills ? skills.split(',').map(s => s.trim()).slice(0, 4) : [];
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="pro-card card-glow fade-in" onClick={() => navigate(`/professionals/${id}`)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div className="pro-avatar">{initials}</div>
        {category && <span className="badge badge-professional">{category}</span>}
      </div>

      <div className="pro-name">{user?.name || 'Professional'}</div>
      {bio && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>
          {bio.length > 90 ? bio.slice(0, 90) + '...' : bio}
        </p>
      )}

      <div className="pro-skills">
        {skillList.map((skill, i) => (
          <span key={i} className="skill-tag">{skill}</span>
        ))}
        {skills && skills.split(',').length > 4 && (
          <span className="skill-tag">+{skills.split(',').length - 4} more</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '12px 0' }}>
        {location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <FiMapPin size={12} /> {location}
          </div>
        )}
        {availability && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <FiClock size={12} /> {availability}
          </div>
        )}
      </div>

      <div className="pro-meta">
        <div className="pro-rate">
          <FiDollarSign size={14} style={{ display: 'inline' }} />
          {hourlyRate ? `${hourlyRate}/hr` : 'Negotiable'}
        </div>
        <div className="pro-rating">
          <FiStar size={13} />
          {averageRating ? averageRating.toFixed(1) : 'New'}
          {totalReviews > 0 && <span style={{ color: 'var(--text-muted)' }}>({totalReviews})</span>}
        </div>
      </div>

      {onHire && (
        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '16px' }}
          onClick={(e) => { e.stopPropagation(); onHire(profile); }}
        >
          Send Hiring Request
        </button>
      )}
    </div>
  );
};

export default ProfessionalCard;
