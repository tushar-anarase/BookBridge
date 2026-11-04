import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  MessageSquare,
  Gift,
  Tag,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { formatCurrency, formatDate } from '../utils/helpers';

export const Requests = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { requests, updateRequestStatus, cancelRequest } = useBooks();

  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'outgoing'
  const [statusFilter, setStatusFilter] = useState('All');

  if (!isAuthenticated) {
    return (
      <div className="container main-content" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Please Log In</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          Log in to track your book requests and respond to fellow readers.
        </p>
        <Link to="/login" className="btn btn-primary">
          Log In
        </Link>
      </div>
    );
  }

  // Incoming: requests where current user is the owner/seller
  const incoming = requests.filter((r) => r.sellerId === currentUser.id);

  // Outgoing: requests sent by current user
  const outgoing = requests.filter((r) => r.buyerId === currentUser.id);

  const displayedList = (activeTab === 'incoming' ? incoming : outgoing).filter((r) => {
    if (statusFilter === 'All') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="container main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.25rem' }}>
          <Inbox size={28} color="var(--primary-color)" /> Book Requests
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage inbound requests for your donated and for-sale books, and follow up on books you requested.
        </p>
      </div>

      {/* Main Mode Toggle: Incoming vs Outgoing */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${activeTab === 'incoming' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('incoming')}
          >
            <Inbox size={16} /> Incoming Requests ({incoming.length})
          </button>
          <button
            className={`btn ${activeTab === 'outgoing' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('outgoing')}
          >
            <Send size={16} /> Outgoing Requests ({outgoing.length})
          </button>
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['All', 'Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'].map((st) => (
            <button
              key={st}
              className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {displayedList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {displayedList.map((req) => (
            <div
              key={req.id}
              className="card request-item-card"
              style={{
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: '1.5rem',
                alignItems: 'center'
              }}
            >
              {/* Book Cover */}
              <Link to={`/book/${req.bookId}`}>
                <img
                  src={req.bookCover}
                  alt={req.bookTitle}
                  style={{
                    width: 80,
                    height: 110,
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                />
              </Link>

              {/* Details & Message */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.25rem' }}>
                  <span className={`badge ${req.listingType === 'donation' ? 'badge-free' : 'badge-fixed'}`}>
                    {req.listingType === 'donation' ? 'Donation' : `Price: ${formatCurrency(req.price)}`}
                  </span>
                  <span className={`badge badge-status-${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    • {formatDate(req.createdAt)}
                  </span>
                </div>

                <Link to={`/book/${req.bookId}`} style={{ fontWeight: 700, fontSize: '1.15rem' }}>
                  {req.bookTitle}
                </Link>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                  by {req.bookAuthor}
                </div>

                <div
                  style={{
                    padding: '0.65rem 0.9rem',
                    backgroundColor: 'var(--bg-color)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.88rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    marginBottom: '0.5rem'
                  }}
                >
                  <MessageSquare size={16} color="var(--primary-color)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <strong>{activeTab === 'incoming' ? req.buyerName : 'Your message'}:</strong> "{req.message}"
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
                  {activeTab === 'incoming' ? (
                    <>
                      <span>Requested by: <strong>{req.buyerName}</strong></span>
                      <span>Email: {req.buyerEmail}</span>
                      <span>City: {req.buyerCity}</span>
                    </>
                  ) : (
                    <>
                      <span>Owner / Seller: <strong>{req.sellerName}</strong></span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '140px', textAlign: 'right' }}>
                {activeTab === 'incoming' ? (
                  <>
                    {req.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Accepted')}
                          className="btn btn-primary btn-sm"
                        >
                          <CheckCircle2 size={15} /> Accept Request
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Rejected')}
                          className="btn btn-outline btn-sm"
                          style={{ color: '#EF4444', borderColor: '#EF4444' }}
                        >
                          <XCircle size={15} /> Reject
                        </button>
                      </>
                    )}
                    {req.status === 'Accepted' && (
                      <button
                        onClick={() => updateRequestStatus(req.id, 'Completed')}
                        className="btn btn-secondary btn-sm"
                      >
                        <CheckCircle2 size={15} /> Mark Completed
                      </button>
                    )}
                    {req.status === 'Completed' && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--status-available)', fontWeight: 600 }}>
                        ✓ Completed
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {req.status === 'Pending' && (
                      <button
                        onClick={() => cancelRequest(req.id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#EF4444', borderColor: '#EF4444' }}
                      >
                        <Ban size={15} /> Cancel Request
                      </button>
                    )}
                    {req.status === 'Accepted' && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--status-available)', fontWeight: 600, textAlign: 'center' }}>
                        Accepted by Owner! Coordinate pickup.
                      </div>
                    )}
                    <Link to={`/book/${req.bookId}`} className="btn btn-ghost btn-sm">
                      <ExternalLink size={14} /> View Book
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Inbox size={48} color="var(--primary-color)" />
          <h3 className="empty-state-title" style={{ marginTop: '1rem' }}>
            No {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} requests found
          </h3>
          <p className="empty-state-desc">
            {activeTab === 'incoming'
              ? 'You do not have any incoming book requests in this view.'
              : 'You have not submitted any book requests in this view.'}
          </p>
          <Link to="/explore" className="btn btn-primary btn-sm">
            Browse Available Books
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .request-item-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
