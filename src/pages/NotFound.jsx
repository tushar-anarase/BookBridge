import React from 'react';
import { Link } from 'react-router-dom';
import { BookX, Home, Search } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="container main-content" style={{ textAlign: 'center', padding: '5rem 0' }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--light-green)',
          color: 'var(--primary-color)',
          margin: '0 auto 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <BookX size={44} />
      </div>

      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>
        This page seems to be missing from our shelves!
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
        The book or page you are looking for might have been moved, borrowed by another reader, or doesn't exist.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary btn-lg">
          <Home size={18} /> Return Home
        </Link>
        <Link to="/explore" className="btn btn-secondary btn-lg">
          <Search size={18} /> Browse Shelves
        </Link>
      </div>
    </div>
  );
};

