import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiSave, FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';

const CATEGORIES = ['Web Development', 'Design', 'Marketing', 'Consulting', 'Writing', 'Finance', 'Engineering', 'Photography', 'Other'];
const AVAILABILITIES = ['Full-time', 'Part-time', 'Weekends', 'Remote', 'Freelance'];

const ManageProfile = () => {
  const [profile, setProfile] = useState({ bio: '', skills: '', hourlyRate: '', location: '', availability: '', category: '', experienceYears: '' });
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '', category: '', price: '' });
  const [saving, setSaving] = useState(false);
  const [addingService, setAddingService] = useState(false);
  const [tab, setTab] = useState('profile');

  useEffect(() => {
    api.get('/professionals/my-profile').then(r => {
      if (r.data && r.data.success !== false) {
        const p = r.data;
        setProfile({ bio: p.bio || '', skills: p.skills || '', hourlyRate: p.hourlyRate || '', location: p.location || '', availability: p.availability || '', category: p.category || '', experienceYears: p.experienceYears || '' });
      }
    }).catch(() => {});
    api.get('/professionals/services/my').then(r => setServices(r.data || [])).catch(() => {});
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/professionals/profile', { ...profile, hourlyRate: parseFloat(profile.hourlyRate) || null, experienceYears: parseInt(profile.experienceYears) || null });
      toast.success('Profile updated successfully!');
    } catch { toast.error('Failed to update profile.'); }
    finally { setSaving(false); }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setAddingService(true);
    try {
      const res = await api.post('/professionals/services', { ...newService, price: parseFloat(newService.price) || null });
      if (res.data.success) {
        setServices(prev => [...prev, res.data.data]);
        setNewService({ title: '', description: '', category: '', price: '' });
        toast.success('Service added!');
      }
    } catch { toast.error('Failed to add service.'); }
    finally { setAddingService(false); }
  };

  const handleDeleteService = async (id) => {
    try {
      await api.delete(`/professionals/services/${id}`);
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success('Service removed.');
    } catch { toast.error('Failed to delete service.'); }
  };

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh' }}>
      <div className="page-container" style={{ paddingTop: '24px', maxWidth: '800px' }}>
        <div className="page-header">
          <h1 className="page-title">Manage Profile</h1>
          <p className="page-subtitle">Build your professional presence and list your services</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: 'fit-content' }}>
          {['profile', 'services'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-secondary'}`} style={{ border: 'none', textTransform: 'capitalize' }}>
              {t === 'profile' ? <FiEdit size={13} /> : <FiPlus size={13} />} {t === 'profile' ? 'My Profile' : 'Services'}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="card fade-in">
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '24px' }}>Profile Information</h2>
            <form onSubmit={handleSaveProfile}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" value={profile.category} onChange={e => setProfile({ ...profile, category: e.target.value })}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <select className="form-control" value={profile.availability} onChange={e => setProfile({ ...profile, availability: e.target.value })}>
                    <option value="">Select Availability</option>
                    {AVAILABILITIES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Hourly Rate (USD)</label>
                  <input className="form-control" type="number" placeholder="e.g. 50" value={profile.hourlyRate} onChange={e => setProfile({ ...profile, hourlyRate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input className="form-control" type="text" placeholder="City, Country or Remote" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Experience (Years)</label>
                  <input className="form-control" type="number" placeholder="e.g. 5" value={profile.experienceYears} onChange={e => setProfile({ ...profile, experienceYears: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Skills (comma-separated)</label>
                <input className="form-control" type="text" placeholder="React, Node.js, UI/UX, Figma..." value={profile.skills} onChange={e => setProfile({ ...profile, skills: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Professional Bio</label>
                <textarea className="form-control" rows={5} placeholder="Describe your expertise, experience, and what makes you unique..." value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <FiSave size={14} /> {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>
        )}

        {tab === 'services' && (
          <div className="fade-in">
            {/* Add Service */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Add New Service</h2>
              <form onSubmit={handleAddService}>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Service Title</label>
                    <input className="form-control" type="text" placeholder="e.g. Full-Stack Web Development" value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select className="form-control" value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })}>
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" rows={3} placeholder="What do you offer?" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Price (USD)</label>
                  <input className="form-control" type="number" placeholder="e.g. 299" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" disabled={addingService}>
                  <FiPlus size={13} /> {addingService ? 'Adding...' : 'Add Service'}
                </button>
              </form>
            </div>

            {/* Service List */}
            <div className="card">
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>My Services ({services.length})</h2>
              {services.length === 0 ? (
                <div className="empty-state" style={{ padding: '32px' }}>
                  <div className="empty-state-icon">🛠️</div>
                  <div className="empty-state-title">No services added yet</div>
                </div>
              ) : services.map(svc => (
                <div key={svc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px 0', borderBottom: '1px solid var(--border)', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700' }}>{svc.title}</div>
                    {svc.category && <span className="badge badge-professional" style={{ marginTop: '6px', marginBottom: '6px' }}>{svc.category}</span>}
                    {svc.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>{svc.description}</p>}
                    {svc.price && <div style={{ color: 'var(--accent-green)', fontWeight: '700', marginTop: '6px' }}>${svc.price}</div>}
                  </div>
                  <button onClick={() => handleDeleteService(svc.id)} className="btn btn-danger btn-sm"><FiTrash2 size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProfile;
