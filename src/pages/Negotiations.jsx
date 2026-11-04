import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Send,
  Sparkles,
  Clock,
  DollarSign,
  TrendingDown,
  User,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { formatCurrency, formatDate, timeAgo } from '../utils/helpers';

export const Negotiations = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { negotiations, sendCounterOffer, respondToOffer } = useBooks();

  // Selected negotiation for detailed view / interaction
  const [selectedNegId, setSelectedNegId] = useState(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterMessage, setCounterMessage] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="container main-content" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Please Log In</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          Log in to view active price negotiations and respond to counteroffers.
        </p>
        <Link to="/login" className="btn btn-primary">
          Log In
        </Link>
      </div>
    );
  }

  // Negotiations involving the current user (either as buyer or seller)
  const myNegotiations = negotiations.filter(
    (n) => n.sellerId === currentUser.id || n.buyerId === currentUser.id
  );

  // Active negotiation being viewed
  const activeNeg =
    myNegotiations.find((n) => n.id === selectedNegId) ||
    myNegotiations[0] ||
    null;

  const handleSendCounter = (e) => {
    e.preventDefault();
    if (!activeNeg) return;
    if (!counterAmount || Number(counterAmount) <= 0) return;

    sendCounterOffer({
      negotiationId: activeNeg.id,
      amount: Number(counterAmount),
      message: counterMessage
    });
    setCounterAmount('');
    setCounterMessage('');
  };

  const handleAccept = () => {
    if (!activeNeg) return;
    respondToOffer({ negotiationId: activeNeg.id, action: 'accept' });
  };

  const handleReject = () => {
    if (!activeNeg) return;
    respondToOffer({ negotiationId: activeNeg.id, action: 'reject' });
  };

  return (
    <div className="container main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.25rem' }}>
          <ArrowRightLeft size={28} color="var(--accent-dark)" /> Price Negotiations & Offers
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Transparent, community-driven price bargaining. Send counteroffers or finalize agreements to reserve books.
        </p>
      </div>

      {myNegotiations.length > 0 && activeNeg ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '1.75rem',
            alignItems: 'start'
          }}
          className="negotiation-layout"
        >
          {/* ================= LEFT LIST OF NEGOTIATIONS ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Your Negotiations ({myNegotiations.length})
            </div>

            {myNegotiations.map((neg) => {
              const isSelected = activeNeg.id === neg.id;
              const isSeller = neg.sellerId === currentUser.id;
              const otherParty = isSeller ? neg.buyerName : neg.sellerName;
              const isMyTurn =
                neg.status === 'Pending' &&
                ((isSeller && neg.lastOfferBy === 'buyer') ||
                  (!isSeller && neg.lastOfferBy === 'seller'));

              return (
                <div
                  key={neg.id}
                  onClick={() => {
                    setSelectedNegId(neg.id);
                    setCounterAmount('');
                  }}
                  style={{
                    backgroundColor: isSelected ? 'var(--light-green-tint)' : '#FFFFFF',
                    border: `1.5px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <img
                      src={neg.bookCover}
                      alt=""
                      style={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {neg.bookTitle}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        with {otherParty}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '0.95rem' }}>
                          {formatCurrency(neg.currentOffer)}
                        </span>
                        <span className={`badge badge-status-${neg.status.toLowerCase()}`} style={{ fontSize: '0.68rem' }}>
                          {neg.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isMyTurn && (
                    <div
                      style={{
                        marginTop: '0.65rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--accent-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <Clock size={12} /> Awaiting your reply!
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ================= RIGHT THREAD & INTERACTIVE CONTROLS ================= */}
          <div className="negotiation-card">
            {/* Header */}
            <div className="negotiation-header">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <img
                  src={activeNeg.bookCover}
                  alt={activeNeg.bookTitle}
                  style={{ width: 50, height: 70, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div>
                  <Link to={`/book/${activeNeg.bookId}`} style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                    {activeNeg.bookTitle}
                  </Link>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    by {activeNeg.bookAuthor} • Listed Price: <strong>{formatCurrency(activeNeg.listedPrice)}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Seller: <strong>{activeNeg.sellerName}</strong> | Buyer: <strong>{activeNeg.buyerName}</strong>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`badge badge-status-${activeNeg.status.toLowerCase()}`} style={{ fontSize: '0.85rem' }}>
                  Status: {activeNeg.status}
                </span>
                <div style={{ marginTop: '0.4rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                  Current: {formatCurrency(activeNeg.currentOffer)}
                </div>
              </div>
            </div>

            {/* Agreed Banner if Accepted */}
            {activeNeg.status === 'Accepted' && (
              <div
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: 'var(--light-green-tint)',
                  borderBottom: '1px solid var(--light-green)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: 'var(--primary-dark)'
                }}
              >
                <CheckCircle2 size={24} color="var(--status-available)" />
                <div>
                  <strong>Deal Agreed at {formatCurrency(activeNeg.currentOffer)}!</strong>
                  <div style={{ fontSize: '0.82rem' }}>
                    Both parties have agreed. The book has been marked as <strong>Reserved</strong>.
                  </div>
                </div>
              </div>
            )}

            {/* Negotiation History Stream */}
            <div className="negotiation-history">
              {activeNeg.history.map((hist) => {
                const isMine = hist.senderId === currentUser.id;
                return (
                  <div
                    key={hist.id}
                    className={`negotiation-bubble ${isMine ? 'mine' : 'theirs'}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: 2 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isMine ? 'var(--primary-dark)' : 'var(--text-secondary)' }}>
                        {isMine ? 'You' : hist.senderName} ({hist.senderRole === 'seller' ? 'Seller' : 'Buyer'})
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {timeAgo(hist.timestamp)}
                      </span>
                    </div>

                    <div className="negotiation-offer-badge">
                      <span>Offer: {formatCurrency(hist.amount)}</span>
                      {activeNeg.listedPrice > hist.amount && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                          (saves {formatCurrency(activeNeg.listedPrice - hist.amount)})
                        </span>
                      )}
                    </div>

                    {hist.message && (
                      <p style={{ fontSize: '0.9rem', marginTop: 4, lineHeight: 1.4 }}>
                        "{hist.message}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Interaction / Counteroffer Controls */}
            {activeNeg.status === 'Pending' ? (
              <div className="negotiation-controls">
                {/* Decision Buttons (Accept or Reject the current counteroffer) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.9rem' }}>
                    Current active offer: <strong style={{ color: 'var(--primary-color)' }}>{formatCurrency(activeNeg.currentOffer)}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: 6 }}>
                      (proposed by {activeNeg.lastOfferBy === (activeNeg.sellerId === currentUser.id ? 'seller' : 'buyer') ? 'You' : 'the other party'})
                    </span>
                  </div>

                  {activeNeg.lastOfferBy !== (activeNeg.sellerId === currentUser.id ? 'seller' : 'buyer') && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={handleAccept} className="btn btn-primary btn-sm">
                        <CheckCircle2 size={16} /> Accept {formatCurrency(activeNeg.currentOffer)}
                      </button>
                      <button
                        onClick={handleReject}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#EF4444', borderColor: '#EF4444' }}
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Counteroffer Form */}
                <form onSubmit={handleSendCounter} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.75rem' }}>
                    Or propose a counteroffer:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--primary-color)' }}>
                        ₹
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        style={{ paddingLeft: '2rem' }}
                        placeholder="Amount"
                        value={counterAmount}
                        onChange={(e) => setCounterAmount(e.target.value)}
                        min="1"
                        required
                      />
                    </div>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add an optional note (e.g. Can do ₹210 if picked up today)..."
                      value={counterMessage}
                      onChange={(e) => setCounterMessage(e.target.value)}
                    />

                    <button type="submit" className="btn btn-accent">
                      <Send size={16} /> Send Counter
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div style={{ padding: '1.25rem', textAlign: 'center', backgroundColor: 'var(--bg-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                This negotiation has concluded with status: <strong>{activeNeg.status}</strong>.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <ArrowRightLeft size={48} color="var(--accent-dark)" />
          <h3 className="empty-state-title" style={{ marginTop: '1rem' }}>No price offers or negotiations yet</h3>
          <p className="empty-state-desc">
            Browse books marked "Open to Offers" on the marketplace and submit your first price proposal!
          </p>
          <Link to="/explore?type=negotiable" className="btn btn-accent btn-sm">
            Explore Negotiable Books
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .negotiation-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

