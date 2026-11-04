import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  });

  const [error, setError] = useState('');

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const res = register(formData);
    if (res.success) {
      showToast(`Welcome to BookBridge, ${res.user.name}!`, 'success');
      navigate('/dashboard');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="container main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-color)',
              color: '#FFFFFF',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BookOpen size={26} />
          </div>
          <h2>Join the BookBridge Community</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Start donating, requesting, and exchanging books with passionate readers
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div
              style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#B91C1C',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. Ananya Rao"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="e.g. ananya@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">City & State</label>
              <input
                type="text"
                name="city"
                className="form-control"
                placeholder="e.g. Pune, Maharashtra"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Short Bio (Optional)</label>
              <textarea
                name="bio"
                className="form-control"
                placeholder="Share your favorite genres or authors..."
                value={formData.bio}
                onChange={handleInputChange}
                rows={2}
              />
            </div>

            {/* Choose Avatar */}
            <div className="form-group">
              <label className="form-label">Select Profile Avatar</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '0.35rem' }}>
                {sampleAvatars.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Avatar choice"
                    onClick={() => setFormData((prev) => ({ ...prev, avatar: url }))}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: formData.avatar === url ? '3px solid var(--primary-color)' : '1px solid var(--border-color)',
                      padding: 2
                    }}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
              <UserPlus size={18} /> Create Account
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary-color)' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

