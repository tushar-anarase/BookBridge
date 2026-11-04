import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogIn, Key, Mail, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DEMO_PASSWORD } from '../utils/seedData';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, users } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const demoAccounts = users.slice(0, 3);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(email, password);
    if (res.success) {
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      navigate('/dashboard');
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  const handleQuickDemoLogin = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(DEMO_PASSWORD);
    const res = login(demoUser.email, DEMO_PASSWORD);
    if (res.success) {
      showToast(`Logged in as demo user: ${demoUser.name}`, 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div className="container main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Header */}
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
          <h2>Sign in to BookBridge</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Enter your credentials or choose a 1-click demo account below
          </p>
        </div>

        {/* 1-Click Demo Logins Banner */}
        <div
          style={{
            backgroundColor: 'var(--light-green-tint)',
            border: '1.5px solid var(--light-green)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.75rem'
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <UserCheck size={16} /> Quick Demo Logins (1-Click)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {demoAccounts.map((u) => (
              <button
                key={u.id}
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', padding: '0.5rem 0.75rem' }}
                onClick={() => handleQuickDemoLogin(u)}
              >
                <img
                  src={u.avatar}
                  alt=""
                  style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontWeight: 600 }}>{u.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                  ({u.email.split('@')[0]})
                </span>
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.65rem' }}>
            Demo password: <code>{DEMO_PASSWORD}</code>
          </div>
        </div>

        {/* Login Form Card */}
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

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. tushar@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
              <LogIn size={18} /> Sign In
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary-color)' }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

