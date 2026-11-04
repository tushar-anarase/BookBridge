import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  BookOpen,
  DollarSign,
  ShieldCheck,
  User,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Tag,
  CheckCircle2,
  Gift,
  ArrowRightLeft
} from 'lucide-react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate, getFallbackCover } from '../utils/helpers';
import { Modal } from '../components/Modal';
import { BookCard } from '../components/BookCard';

export const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, createRequest, createOffer, wishlist, toggleWishlist } = useBooks();
  const { currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const book = books.find((b) => b.id === id);

  // Fallback image state
  const [coverImg, setCoverImg] = useState(() =>
    book ? book.coverImage || getFallbackCover(book.title, book.author) : ''
  );

  // Modal states
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  if (!book) {
    return (
      <div className="container main-content" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Book Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          The book listing you are looking for may have been removed or does not exist.
        </p>
        <Link to="/explore" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Explore
        </Link>
      </div>
    );
  }

  const isOwner = currentUser && currentUser.id === book.ownerId;
  const isWish = wishlist.includes(book.id);
  const isAvailable = book.status === 'Available';

  // Related books (same category, excluding current)
  const relatedBooks = books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Listing URL copied to clipboard!', 'info');
    } else {
      showToast('Share link: ' + window.location.href, 'info');
    }
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const res = createRequest({ bookId: book.id, message: requestMessage });
    if (res.success) {
      setRequestModalOpen(false);
      setRequestMessage('');
      navigate('/requests');
    }
  };

  const handleOfferSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!offerAmount || Number(offerAmount) <= 0) {
      showToast('Please enter a valid offer amount', 'error');
      return;
    }
    const res = createOffer({
      bookId: book.id,
      offerAmount: Number(offerAmount),
      message: offerMessage
    });
    if (res.success) {
      setOfferModalOpen(false);
      setOfferAmount('');
      setOfferMessage('');
      navigate('/negotiations');
    } else if (res.existingId) {
      setOfferModalOpen(false);
      navigate('/negotiations');
    }
  };

  return (
    <div className="container main-content">
      {/* Back breadcrumb */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={16} /> Back to books
        </button>
      </div>

      {/* Main Details Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: '2.5rem',
          alignItems: 'start'
        }}
        className="book-details-grid"
      >
        {/* Left Column: Book Cover & Actions */}
        <div>
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-book)',
              border: '1px solid var(--border-color)',
              backgroundColor: '#FFFFFF',
              marginBottom: '1.5rem'
            }}
          >
            <img
              src={coverImg || book.coverImage}
              alt={book.title}
              onError={() => setCoverImg(getFallbackCover(book.title, book.author))}
              style={{
                width: '100%',
                maxHeight: '520px',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Badges Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              {book.listingType === 'donation' && (
                <span className="badge badge-free" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}>
                  <Gift size={14} /> FREE DONATION
                </span>
              )}
              {book.listingType === 'negotiable' && (
                <span className="badge badge-negotiable" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}>
                  <ArrowRightLeft size={14} /> OPEN TO OFFERS
                </span>
              )}
              {book.listingType === 'fixed' && (
                <span className="badge badge-fixed" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}>
                  <Tag size={14} /> FIXED PRICE
                </span>
              )}
              {book.status !== 'Available' && (
                <span className={`badge badge-status-${book.status.toLowerCase()}`}>
                  {book.status}
                </span>
              )}
            </div>
          </div>

          {/* Quick Action Buttons for Cover */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => toggleWishlist(book.id)}
              className={`btn ${isWish ? 'btn-secondary' : 'btn-outline'}`}
              style={{ flex: 1 }}
            >
              <Heart size={16} fill={isWish ? '#E53935' : 'none'} color={isWish ? '#E53935' : 'currentColor'} />
              {isWish ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>
            <button onClick={handleShare} className="btn btn-outline" title="Share book listing">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Information & Interactions */}
        <div>
          {/* Category & Condition tags */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem' }}>
            <span className="badge badge-category">{book.category}</span>
            <span className="badge badge-condition">Condition: {book.condition}</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.4rem', color: 'var(--primary-color)' }}>
            {book.title}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            by <strong style={{ color: 'var(--text-main)' }}>{book.author}</strong>
          </p>

          {/* Price Box */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {book.listingType === 'donation' ? 'Listing Fee' : 'Expected Price'}
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                {formatCurrency(book.price)}
              </div>
            </div>

            {book.listingType === 'negotiable' && (
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-negotiable">Negotiable</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Counteroffers welcome
                </p>
              </div>
            )}
          </div>

          {/* Action Trigger Box */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--light-green-tint)',
              border: '1px solid var(--light-green)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem'
            }}
          >
            {isOwner ? (
              <div>
                <p style={{ fontWeight: 600, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                  📌 This is your listing.
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  You can edit details, change availability, or remove this listing from your bookshelf.
                </p>
                <Link to="/bookshelf" className="btn btn-primary">
                  Manage in My Bookshelf
                </Link>
              </div>
            ) : !isAvailable ? (
              <div>
                <p style={{ fontWeight: 600, color: '#D32F2F', marginBottom: '0.5rem' }}>
                  This book is currently {book.status}.
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  A reader has already requested or negotiated this book. You can save it to your wishlist to check back later.
                </p>
              </div>
            ) : (
              <div>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Interested in this book?</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  {book.listingType === 'donation'
                    ? 'This book is being gifted for free. Send a polite request to the donor to arrange pickup.'
                    : book.listingType === 'negotiable'
                    ? 'The seller welcomes price offers. Propose your best price and wait for a response or counteroffer.'
                    : 'The seller listed this book at a fixed price. Send a purchase request to proceed.'}
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {book.listingType === 'donation' && (
                    <button
                      onClick={() => (isAuthenticated ? setRequestModalOpen(true) : navigate('/login'))}
                      className="btn btn-primary btn-lg"
                    >
                      <Gift size={18} /> Request Free Book
                    </button>
                  )}

                  {book.listingType === 'fixed' && (
                    <button
                      onClick={() => (isAuthenticated ? setRequestModalOpen(true) : navigate('/login'))}
                      className="btn btn-primary btn-lg"
                    >
                      <CheckCircle2 size={18} /> Send Purchase Request
                    </button>
                  )}

                  {book.listingType === 'negotiable' && (
                    <>
                      <button
                        onClick={() => (isAuthenticated ? setOfferModalOpen(true) : navigate('/login'))}
                        className="btn btn-accent btn-lg"
                      >
                        <ArrowRightLeft size={18} /> Make a Price Offer
                      </button>
                      <button
                        onClick={() => (isAuthenticated ? setRequestModalOpen(true) : navigate('/login'))}
                        className="btn btn-outline btn-lg"
                      >
                        Buy at Listed Price ({formatCurrency(book.price)})
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Book Metadata Attributes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
              padding: '1.25rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Language</span>
              <div style={{ fontWeight: 600 }}>{book.language}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pages</span>
              <div style={{ fontWeight: 600 }}>{book.pages} pages</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Published</span>
              <div style={{ fontWeight: 600 }}>{book.publishedYear}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Listed On</span>
              <div style={{ fontWeight: 600 }}>{formatDate(book.createdAt)}</div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>About This Book</h3>
            <p style={{ color: 'var(--text-main)', lineHeight: 1.7, fontSize: '0.98rem' }}>
              {book.description}
            </p>
          </div>

          {/* Owner / Seller Card */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--light-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-color)',
                  fontWeight: 700,
                  fontSize: '1.2rem'
                }}
              >
                {book.ownerName.charAt(0)}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Listed By
                </span>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary-color)' }}>
                  {book.ownerName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={13} /> {book.ownerCity}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-status-available">Verified Member</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RELATED BOOKS ================= */}
      {relatedBooks.length > 0 && (
        <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>More in {book.category}</h2>
          <div className="grid grid-cols-3">
            {relatedBooks.map((rel) => (
              <BookCard key={rel.id} book={rel} />
            ))}
          </div>
        </div>
      )}

      {/* ================= REQUEST MODAL ================= */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title={book.listingType === 'donation' ? 'Request Donated Book' : 'Send Purchase Request'}
        footer={
          <>
            <button onClick={() => setRequestModalOpen(false)} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={handleRequestSubmit} className="btn btn-primary">
              Confirm & Send Request
            </button>
          </>
        }
      >
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Sending request to <strong>{book.ownerName}</strong> for "<strong>{book.title}</strong>".
          </p>

          <div className="form-group">
            <label className="form-label">
              Message to Owner / Seller <span className="required">*</span>
            </label>
            <textarea
              className="form-control"
              placeholder="Hi! I am eager to read this book. Let me know when and where we can arrange pickup..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              rows={4}
              required
            />
            <span className="form-help">
              Polite and clear messages receive significantly faster replies.
            </span>
          </div>
        </div>
      </Modal>

      {/* ================= MAKE OFFER MODAL ================= */}
      <Modal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        title={`Make a Price Offer for "${book.title}"`}
        footer={
          <>
            <button onClick={() => setOfferModalOpen(false)} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={handleOfferSubmit} className="btn btn-accent">
              Submit Offer
            </button>
          </>
        }
      >
        <div>
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-color)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Listed Price:</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
              {formatCurrency(book.price)}
            </strong>
          </div>

          <div className="form-group">
            <label className="form-label">
              Your Offer Amount (₹ INR) <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: 700,
                  color: 'var(--primary-color)'
                }}
              >
                ₹
              </span>
              <input
                type="number"
                className="form-control"
                style={{ paddingLeft: '2rem' }}
                placeholder="e.g. 180"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                min="1"
                required
              />
            </div>
            <span className="form-help">
              Propose a reasonable price that values the book while saving you money.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Note for the Seller (Optional)</label>
            <textarea
              className="form-control"
              placeholder="e.g., I can pick it up today or cover delivery..."
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 900px) {
          .book-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

