import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Gift,
  Tag,
  Inbox,
  Send,
  CheckCircle2,
  ArrowRightLeft,
  Clock,
  PlusCircle,
  Library,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { formatCurrency, formatDate } from '../utils/helpers';

export const Dashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { books, requests, negotiations, updateRequestStatus } = useBooks();
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming', 'outgoing', 'negotiations', 'listings'

  if (!isAuthenticated) {
    return (
      <div className="container main-content" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Please Log In</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          Log in to access your personal dashboard, track book requests, and view transactions.
        </p>
        <Link to="/login" className="btn btn-primary">
          Log In
        </Link>
      </div>
    );
  }

  // User-specific data
  const myBooks = books.filter((b) => b.ownerId === currentUser.id);
  const myDonatedBooks = myBooks.filter((b) => b.listingType === 'donation');
  const mySaleBooks = myBooks.filter((b) => b.listingType !== 'donation');

  const incomingRequests = requests.filter((r) => r.sellerId === currentUser.id);
  const outgoingRequests = requests.filter((r) => r.buyerId === currentUser.id);

  const myNegotiations = negotiations.filter(
    (n) => n.sellerId === currentUser.id || n.buyerId === currentUser.id
  );

  const completedTransactions = requests.filter(
    (r) => (r.sellerId === currentUser.id || r.buyerId === currentUser.id) && r.status === 'Completed'
  );

  return (
    <div className="container main-content">
      {/* Dashboard Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>
            Welcome back, {currentUser.name.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Here is your book sharing summary and active exchanges in {currentUser.city}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/donate" className="btn btn-primary btn-sm">
            <Gift size={16} /> Donate Book
          </Link>
          <Link to="/sell" className="btn btn-accent btn-sm">
            <Tag size={16} /> Sell Book
          </Link>
        </div>
      </div>

      {/* ================= 6 STATS CARDS ================= */}
      <div className="stats-grid">
        {/* Total Listed Books */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--light-green)', color: 'var(--primary-color)' }}>
            <Library size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              {myBooks.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Listed Books</div>
          </div>
        </div>

        {/* Donated Books */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
            <Gift size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2E7D32' }}>
              {myDonatedBooks.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Donated Books</div>
          </div>
        </div>

        {/* Books For Sale */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)' }}>
            <Tag size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-dark)' }}>
              {mySaleBooks.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Books For Sale</div>
          </div>
        </div>

        {/* Incoming Requests */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#FFF3E0', color: '#E65100' }}>
            <Inbox size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#E65100' }}>
              {incomingRequests.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Incoming Requests</div>
          </div>
        </div>

        {/* Outgoing Requests */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#E3F2FD', color: '#1565C0' }}>
            <Send size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1565C0' }}>
              {outgoingRequests.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Outgoing Requests</div>
          </div>
        </div>

        {/* Successful Exchanges */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--light-green-tint)', color: 'var(--primary-dark)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              {completedTransactions.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Exchanges Completed</div>
          </div>
        </div>
      </div>

      {/* ================= TAB NAVIGATION ================= */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          className={`btn ${activeTab === 'incoming' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('incoming')}
        >
          <Inbox size={16} /> Incoming Requests ({incomingRequests.length})
        </button>
        <button
          className={`btn ${activeTab === 'outgoing' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('outgoing')}
        >
          <Send size={16} /> Outgoing Requests ({outgoingRequests.length})
        </button>
        <button
          className={`btn ${activeTab === 'negotiations' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('negotiations')}
        >
          <ArrowRightLeft size={16} /> Offers ({myNegotiations.length})
        </button>
        <button
          className={`btn ${activeTab === 'listings' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('listings')}
        >
          <Library size={16} /> Recent Listings ({myBooks.length})
        </button>
      </div>

      {/* ================= TAB CONTENT ================= */}

      {/* 1. INCOMING REQUESTS */}
      {activeTab === 'incoming' && (
        <div>
          {incomingRequests.length > 0 ? (
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Requester</th>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incomingRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={req.bookCover}
                            alt=""
                            style={{ width: 36, height: 50, objectFit: 'cover', borderRadius: 4 }}
                          />
                          <div>
                            <Link to={`/book/${req.bookId}`} style={{ fontWeight: 600 }}>
                              {req.bookTitle}
                            </Link>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              by {req.bookAuthor}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{req.buyerName}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {req.buyerCity}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${req.listingType === 'donation' ? 'badge-free' : 'badge-fixed'}`}>
                          {req.listingType === 'donation' ? 'Donation' : formatCurrency(req.price)}
                        </span>
                      </td>
                      <td style={{ maxWidth: '240px', fontSize: '0.85rem' }}>
                        "{req.message}"
                      </td>
                      <td>
                        <span className={`badge badge-status-${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => updateRequestStatus(req.id, 'Accepted')}
                              className="btn btn-primary btn-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateRequestStatus(req.id, 'Rejected')}
                              className="btn btn-ghost btn-sm"
                              style={{ color: '#EF4444' }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : req.status === 'Accepted' ? (
                          <button
                            onClick={() => updateRequestStatus(req.id, 'Completed')}
                            className="btn btn-secondary btn-sm"
                          >
                            Mark Complete
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Inbox size={42} color="var(--primary-color)" />
              <h3 className="empty-state-title" style={{ marginTop: '1rem' }}>No incoming requests yet</h3>
              <p className="empty-state-desc">
                When fellow readers request your donated or for-sale books, their requests will appear right here.
              </p>
              <Link to="/donate" className="btn btn-primary btn-sm">
                Donate a Book
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 2. OUTGOING REQUESTS */}
      {activeTab === 'outgoing' && (
        <div>
          {outgoingRequests.length > 0 ? (
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Owner / Seller</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {outgoingRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={req.bookCover}
                            alt=""
                            style={{ width: 36, height: 50, objectFit: 'cover', borderRadius: 4 }}
                          />
                          <div>
                            <Link to={`/book/${req.bookId}`} style={{ fontWeight: 600 }}>
                              {req.bookTitle}
                            </Link>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              by {req.bookAuthor}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{req.sellerName}</strong>
                      </td>
                      <td>
                        <span className={`badge ${req.listingType === 'donation' ? 'badge-free' : 'badge-fixed'}`}>
                          {req.listingType === 'donation' ? 'Donation' : formatCurrency(req.price)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-status-${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>{formatDate(req.createdAt)}</td>
                      <td>
                        {req.status === 'Pending' ? (
                          <button
                            onClick={() => updateRequestStatus(req.id, 'Cancelled')}
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#EF4444' }}
                          >
                            Cancel Request
                          </button>
                        ) : (
                          <Link to={`/book/${req.bookId}`} className="btn btn-outline btn-sm">
                            View Book
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Send size={42} color="var(--primary-color)" />
              <h3 className="empty-state-title" style={{ marginTop: '1rem' }}>No outgoing requests</h3>
              <p className="empty-state-desc">
                Browse our collection to discover books and request donations or purchase second-hand copies.
              </p>
              <Link to="/explore" className="btn btn-primary btn-sm">
                Explore Books
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 3. NEGOTIATIONS */}
      {activeTab === 'negotiations' && (
        <div>
          {myNegotiations.length > 0 ? (
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Your Role</th>
                    <th>Listed Price</th>
                    <th>Current Offer</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myNegotiations.map((neg) => {
                    const isSeller = neg.sellerId === currentUser.id;
                    return (
                      <tr key={neg.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img
                              src={neg.bookCover}
                              alt=""
                              style={{ width: 36, height: 50, objectFit: 'cover', borderRadius: 4 }}
                            />
                            <div>
                              <Link to={`/book/${neg.bookId}`} style={{ fontWeight: 600 }}>
                                {neg.bookTitle}
                              </Link>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                {isSeller ? `Buyer: ${neg.buyerName}` : `Seller: ${neg.sellerName}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-category">
                            {isSeller ? 'Seller' : 'Buyer'}
                          </span>
                        </td>
                        <td>{formatCurrency(neg.listedPrice)}</td>
                        <td>
                          <strong style={{ color: 'var(--primary-color)', fontSize: '1rem' }}>
                            {formatCurrency(neg.currentOffer)}
                          </strong>
                        </td>
                        <td>
                          <span className={`badge badge-status-${neg.status.toLowerCase()}`}>
                            {neg.status}
                          </span>
                        </td>
                        <td>
                          <Link to="/negotiations" className="btn btn-accent btn-sm">
                            Open Chat & History <ChevronRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <ArrowRightLeft size={42} color="var(--accent-dark)" />
              <h3 className="empty-state-title" style={{ marginTop: '1rem' }}>No active negotiations</h3>
              <p className="empty-state-desc">
                Negotiate prices on "Open to Offers" books to save money and find great reads.
              </p>
              <Link to="/explore?type=negotiable" className="btn btn-accent btn-sm">
                Browse Negotiable Books
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 4. RECENT LISTINGS */}
      {activeTab === 'listings' && (
        <div>
          {myBooks.length > 0 ? (
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myBooks.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={b.coverImage}
                            alt=""
                            style={{ width: 36, height: 50, objectFit: 'cover', borderRadius: 4 }}
                          />
                          <div>
                            <Link to={`/book/${b.id}`} style={{ fontWeight: 600 }}>
                              {b.title}
                            </Link>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              by {b.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{b.category}</td>
                      <td>
                        <span className={`badge ${b.listingType === 'donation' ? 'badge-free' : 'badge-fixed'}`}>
                          {b.listingType === 'donation' ? 'Donation' : b.listingType === 'negotiable' ? 'Negotiable' : 'Fixed'}
                        </span>
                      </td>
                      <td>{formatCurrency(b.price)}</td>
                      <td>
                        <span className={`badge badge-status-${b.status.toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <Link to="/bookshelf" className="btn btn-outline btn-sm">
                          Manage in Bookshelf
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Library size={42} color="var(--primary-color)" />
              <h3 className="empty-state-title" style={{ marginTop: '1rem' }}>Your bookshelf is empty</h3>
              <p className="empty-state-desc">
                You haven't listed any books yet. Share unused books with your community!
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/donate" className="btn btn-primary btn-sm">
                  Donate Free Book
                </Link>
                <Link to="/sell" className="btn btn-accent btn-sm">
                  Sell a Book
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

