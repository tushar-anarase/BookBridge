import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Heart,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  PlusCircle,
  DollarSign,
  ArrowRightLeft,
  LayoutDashboard,
  Inbox,
  Library
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';

export const Navbar = () => {
  const { currentUser, users, switchAccount, logout, isAuthenticated } = useAuth();
  const { wishlist, requests, negotiations } = useBooks();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute pending notification counts for current user
  const incomingReqCount = currentUser
    ? requests.filter((r) => r.sellerId === currentUser.id && r.status === 'Pending').length
    : 0;

  const activeNegCount = currentUser
    ? negotiations.filter(
        (n) =>
          n.status === 'Pending' &&
          ((n.sellerId === currentUser.id && n.lastOfferBy === 'buyer') ||
            (n.buyerId === currentUser.id && n.lastOfferBy === 'seller'))
      ).length
    : 0;

  const handleAccountSwitch = (userId) => {
    switchAccount(userId);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-box">
            <BookOpen size={22} />
          </div>
          <span className="brand-name">
            Book<span>Bridge</span>
          </span>
        </Link>

        {/* Navigation Menu (Desktop & Mobile) */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore Books
          </NavLink>
          <NavLink
            to="/donate"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <PlusCircle size={15} /> Donate
          </NavLink>
          <NavLink
            to="/sell"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <DollarSign size={15} /> Sell
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={15} /> Dashboard
              </NavLink>
              <NavLink
                to="/requests"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Inbox size={15} /> Requests
                {incomingReqCount > 0 && (
                  <span className="nav-badge">{incomingReqCount}</span>
                )}
              </NavLink>
              <NavLink
                to="/negotiations"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ArrowRightLeft size={15} /> Offers
                {activeNegCount > 0 && (
                  <span className="nav-badge">{activeNegCount}</span>
                )}
              </NavLink>
            </>
          )}

          <NavLink
            to="/wishlist"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Heart size={15} /> Wishlist
            {wishlist.length > 0 && (
              <span className="nav-badge">{wishlist.length}</span>
            )}
          </NavLink>
        </nav>

        {/* Action Controls & User Account Switcher */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="account-switcher" ref={dropdownRef}>
              <button
                className="account-pill-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                title="Switch demo account or manage profile"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="account-pill-avatar"
                />
                <span className="account-pill-text">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown size={14} color="var(--primary-color)" />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">Demo Accounts (1-Click Switch)</div>
                  {users.slice(0, 3).map((u) => (
                    <button
                      key={u.id}
                      className={`dropdown-item ${currentUser.id === u.id ? 'active-user' : ''}`}
                      onClick={() => handleAccountSwitch(u.id)}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span>{u.name}</span>
                      {currentUser.id === u.id && (
                        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--primary-color)' }}>
                          Active
                        </span>
                      )}
                    </button>
                  ))}

                  <div className="dropdown-header" style={{ marginTop: '0.4rem' }}>
                    My Account
                  </div>
                  <Link
                    to="/bookshelf"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Library size={16} /> My Bookshelf
                  </Link>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} /> Profile Details
                  </Link>
                  <button
                    className="dropdown-item"
                    style={{ color: '#EF4444' }}
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

