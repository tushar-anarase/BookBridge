import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Tag, Sparkles, MapPin } from 'lucide-react';
import { formatCurrency, getFallbackCover } from '../utils/helpers';
import { useBooks } from '../context/BookContext';

export const BookCard = ({ book }) => {
  const { wishlist, toggleWishlist } = useBooks();
  const [imgSrc, setImgSrc] = useState(book.coverImage || getFallbackCover(book.title, book.author));
  const isWish = wishlist.includes(book.id);

  const handleImageError = () => {
    setImgSrc(getFallbackCover(book.title, book.author));
  };

  const getListingBadge = () => {
    if (book.listingType === 'donation') {
      return <span className="badge badge-free">Donation</span>;
    }
    if (book.listingType === 'negotiable') {
      return <span className="badge badge-negotiable">Open to Offers</span>;
    }
    return <span className="badge badge-fixed">Fixed Price</span>;
  };

  return (
    <div className="book-card">
      <div className="book-card-cover-wrapper">
        <Link to={`/book/${book.id}`}>
          <img
            src={imgSrc}
            alt={book.title}
            className="book-card-cover"
            onError={handleImageError}
            loading="lazy"
          />
        </Link>
        
        <div className="book-card-badges">
          {getListingBadge()}
          {book.status !== 'Available' && (
            <span className={`badge badge-status-${book.status.toLowerCase()}`}>
              {book.status}
            </span>
          )}
        </div>

        <button
          className={`book-card-wishlist-btn ${isWish ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(book.id);
          }}
          title={isWish ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart size={18} fill={isWish ? '#E53935' : 'none'} />
        </button>
      </div>

      <div className="book-card-body">
        <div className="book-card-meta">
          <span className="book-card-category">{book.category}</span>
          <span className="badge badge-condition">{book.condition}</span>
        </div>

        <Link to={`/book/${book.id}`}>
          <h3 className="book-card-title" title={book.title}>
            {book.title}
          </h3>
        </Link>
        <p className="book-card-author">by {book.author}</p>

        <div className="book-card-footer">
          <div className="book-card-price-box">
            <span className="book-card-price-label">
              {book.listingType === 'donation' ? 'Cost' : 'Price'}
            </span>
            <span className="book-card-price">
              {formatCurrency(book.price)}
            </span>
          </div>

          <div className="book-card-owner" title={`Listed by ${book.ownerName} in ${book.ownerCity}`}>
            <MapPin size={13} style={{ marginRight: -3 }} />
            <span>{book.ownerCity.split(',')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

