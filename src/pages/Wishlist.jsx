import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, Trash2 } from 'lucide-react';
import { useBooks } from '../context/BookContext';
import { BookCard } from '../components/BookCard';

export const Wishlist = () => {
  const { wishlist, books, toggleWishlist } = useBooks();

  const wishlistedBooks = books.filter((book) => wishlist.includes(book.id));

  return (
    <div className="container main-content">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.25rem' }}>
          <Heart size={28} color="#E53935" fill="#E53935" /> Saved Wishlist
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Keep track of books you are eager to read or purchase later.
        </p>
      </div>

      {wishlistedBooks.length > 0 ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing {wishlistedBooks.length} saved {wishlistedBooks.length === 1 ? 'book' : 'books'}
            </span>
          </div>

          <div className="grid grid-cols-4">
            {wishlistedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ backgroundColor: '#FFEBEE', color: '#E53935' }}>
            <Heart size={36} />
          </div>
          <h3 className="empty-state-title">Your wishlist is empty</h3>
          <p className="empty-state-desc">
            Explore our curated shelves and click the heart icon on any book card to save it for later.
          </p>
          <Link to="/explore" className="btn btn-primary">
            <BookOpen size={16} /> Explore Available Books
          </Link>
        </div>
      )}
    </div>
  );
};

