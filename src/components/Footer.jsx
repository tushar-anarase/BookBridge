import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, RefreshCw } from 'lucide-react';
import { useBooks } from '../context/BookContext';

export const Footer = () => {
  const { resetToDemo } = useBooks();

  const handleResetClick = () => {
    if (window.confirm('Reset all demo data back to default? All local changes will be refreshed to seed state.')) {
      resetToDemo();
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand info */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: 'var(--accent-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <BookOpen size={20} />
              </div>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>BookBridge</h3>
            </div>
            <p>
              "Every Book Deserves Another Reader."
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#B3C8B7' }}>
              A community-based platform connecting book donors, eager readers, and sellers to reduce book waste and make quality reading affordable for all.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <div className="footer-title">Platform</div>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/explore">Explore Books</Link></li>
              <li><Link to="/donate">Donate a Book</Link></li>
              <li><Link to="/sell">Sell a Book</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
            </ul>
          </div>

          {/* Member Area */}
          <div>
            <div className="footer-title">Community</div>
            <ul className="footer-links">
              <li><Link to="/dashboard">My Dashboard</Link></li>
              <li><Link to="/bookshelf">My Bookshelf</Link></li>
              <li><Link to="/requests">Book Requests</Link></li>
              <li><Link to="/negotiations">Price Offers</Link></li>
              <li><Link to="/profile">Member Profile</Link></li>
            </ul>
          </div>

          {/* Demo Controls & Mission */}
          <div>
            <div className="footer-title">Interactive Demo</div>
            <p style={{ fontSize: '0.82rem', color: '#DCE9DD', marginBottom: '1rem', lineHeight: 1.5 }}>
              Test both buyer & seller roles seamlessly using the account switcher in the navigation bar.
            </p>
            <button
              onClick={handleResetClick}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
              title="Reset all localStorage records back to default demo state"
            >
              <RefreshCw size={14} />
              Reset Demo Data
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} BookBridge Inc. All rights reserved. Built with React.js & Pure CSS3.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Crafted with</span>
            <Heart size={14} color="#D6A66A" fill="#D6A66A" />
            <span>for book lovers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

