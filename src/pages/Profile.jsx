import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Calendar,
  Star,
  Award,
  BookOpen,
  Gift,
  Tag,
  Save,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { useToast } from '../context/ToastContext';
import { BookCard } from '../components/BookCard';

export const Profile = () => {
  const { currentUser, updateProfile, isAuthenticated } = useAuth();
  const { books } = useBooks();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    city: currentUser?.city || '',
    bio: currentUser?.bio || '',
    avatar: currentUser?.avatar || ''
  });

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="container main-content" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Please Log In</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          Please log in to view and manage your community profile.
        </p>
        <Link to="/login" className="btn btn-primary">
          Log In
        </Link>
      </div>
    );
  }

  const userBooks = books.filter((b) => b.ownerId === currentUser.id);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(profileData);
    setIsEditing(false);
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="container main-content">
      {/* Profile Header Card */}
      <div
        className="card"
        style={{
          padding: '2.5rem',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, #FFFFFF 0%, var(--bg-surface-alt) 100%)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          {/* Avatar & User Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: 96,
                height: 96,
                borderRadius: 'var(--radius-full)',
                objectFit: 'cover',
                border: '4px solid #FFFFFF',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{currentUser.name}</h1>
                <span className="badge badge-negotiable">
                  <Award size={12} /> {currentUser.badge || 'Active Reader'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Mail size={14} /> {currentUser.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={14} /> {currentUser.city}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={14} /> Member since {currentUser.joinedDate || '2025'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-dark)', fontWeight: 700 }}>
                  <Star size={14} fill="currentColor" /> {currentUser.rating || 5.0} Rating
                </span>
              </div>

              <p style={{ marginTop: '0.75rem', fontSize: '0.92rem', color: 'var(--text-main)', maxWidth: '580px' }}>
                "{currentUser.bio}"
              </p>
            </div>
          </div>

          {/* Edit Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`btn ${isEditing ? 'btn-ghost' : 'btn-outline'}`}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSave} style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Update Profile Details</h3>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">City & State</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reader Bio</label>
              <textarea
                className="form-control"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Books Listed by this user */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2>Books Listed by {currentUser.name.split(' ')[0]}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Currently visible to the community in Explore Books
            </p>
          </div>
          <Link to="/bookshelf" className="btn btn-outline btn-sm">
            Manage All in Bookshelf
          </Link>
        </div>

        {userBooks.length > 0 ? (
          <div className="grid grid-cols-4">
            {userBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <BookOpen size={42} color="var(--primary-color)" />
            <h3 className="empty-state-title" style={{ marginTop: '1rem' }}>No books listed yet</h3>
            <p className="empty-state-desc">
              Share your reading passion! List a book for donation or second-hand sale today.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/donate" className="btn btn-primary btn-sm">
                Donate a Book
              </Link>
              <Link to="/sell" className="btn btn-accent btn-sm">
                Sell a Book
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

