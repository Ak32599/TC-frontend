import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProfessionalCard from '../components/ProfessionalCard';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const CATEGORIES = ['', 'Web Development', 'Design', 'Marketing', 'Consulting', 'Writing', 'Finance', 'Engineering', 'Photography'];

const SearchProfessionals = () => {
  const [searchParams] = useSearchParams();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [location, setLocation] = useState('');

  useEffect(() => { fetchProfessionals(); }, []);

  const fetchProfessionals = async (cat = category, loc = location, skill = keyword) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat) params.append('category', cat);
      if (loc) params.append('location', loc);
      if (skill) params.append('skill', skill);
      const res = await api.get(`/professionals/search?${params.toString()}`);
      setProfessionals(res.data || []);
    } catch { setProfessionals([]); } finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchProfessionals(category, location, keyword); };
  const handleClear = () => { setKeyword(''); setCategory(''); setLocation(''); fetchProfessionals('', '', ''); };

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="page-container" style={{ paddingTop: '24px' }}>
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Find Professionals</h1>
          <p className="page-subtitle">Browse and hire top-rated professionals for your needs</p>
        </div>

        {/* Search & Filters */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <form onSubmit={handleSearch}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Search by Skill</label>
                <div style={{ position: 'relative' }}>
                  <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="form-control" style={{ paddingLeft: '36px' }} type="text"
                    placeholder="e.g. React, Design..." value={keyword} onChange={e => setKeyword(e.target.value)} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Category</label>
                <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map((c, i) => <option key={i} value={c}>{c || 'All Categories'}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Location</label>
                <input className="form-control" type="text" placeholder="City or Remote"
                  value={location} onChange={e => setLocation(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary"><FiFilter size={14}/> Filter</button>
                {(keyword || category || location) && (
                  <button type="button" className="btn btn-secondary" onClick={handleClear}><FiX size={14}/></button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {loading ? 'Searching...' : `${professionals.length} professional${professionals.length !== 1 ? 's' : ''} found`}
          </span>
        </div>

        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /><p className="loading-text">Finding professionals...</p></div>
        ) : professionals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No professionals found</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="pros-grid">
            {professionals.map(p => <ProfessionalCard key={p.id} profile={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProfessionals;
