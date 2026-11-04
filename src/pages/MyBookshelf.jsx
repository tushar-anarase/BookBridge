import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Library,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  PlusCircle,
  Gift,
  Tag,
  AlertTriangle,
  Eye,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Modal } from '../components/Modal';
import { CATEGORIES, CONDITIONS } from '../utils/seedData';

export const MyBookshelf = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { books, updateBook, deleteBook, changeAvailability, requests } = useBooks();

  const [statusFilter, setStatusFilter] = useState('All');
  const [editingBook, setEditingBook] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  if (!isAuthenticated) {
    return (
      <div className="container main-content" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Please Log In</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          Log in to view and manage your listed books and availability.
        </p>
        <Link to="/login" className="btn btn-primary">
          Log In
        </Link>
      </div>
    );
  }

  const myBooks = books.filter((b) => b.ownerId === currentUser.id);

  const filteredBooks = myBooks.filter((book) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Completed') {
      return book.status === 'Donated' || book.status === 'Sold';
    }
    return book.status === statusFilter;
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingBook) return;

    updateBook(editingBook.id, {
      title: editingBook.title,
      author: editingBook.author,
      category: editingBook.category,
      condition: editingBook.condition,
      price: editingBook.listingType === 'donation' ? 0 : Number(editingBook.price) || 0,
      description: editingBook.description,
      ownerCity: editingBook.ownerCity
    });
    setEditingBook(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteBook(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="container main-content">
      {/* Bookshelf Header */}
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
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.25rem' }}>
            <Library size={28} color="var(--primary-color)" /> My Bookshelf
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your personal inventory, update book details, and track availability statuses.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/donate" className="btn btn-primary btn-sm">
            <Gift size={16} /> Donate Another Book
          </Link>
          <Link to="/sell" className="btn btn-accent btn-sm">
            <Tag size={16} /> Sell Another Book
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {['All', 'Available', 'Reserved', 'Completed'].map((tab) => {
          const count = myBooks.filter((b) => {
            if (tab === 'All') return true;
            if (tab === 'Completed') return b.status === 'Donated' || b.status === 'Sold';
            return b.status === tab;
          }).length;

          return (
            <button
              key={tab}
              className={`btn ${statusFilter === tab ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setStatusFilter(tab)}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Books Table or Empty State */}
      {filteredBooks.length > 0 ? (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Category & Condition</th>
                <th>Listing Type</th>
                <th>Price</th>
                <th>Availability Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  {/* Book details */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={book.coverImage}
                        alt=""
                        style={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                      <div>
                        <Link to={`/book/${book.id}`} style={{ fontWeight: 700, fontSize: '0.98rem' }}>
                          {book.title}
                        </Link>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          by {book.author}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Listed on {formatDate(book.createdAt)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category & Condition */}
                  <td>
                    <div>{book.category}</div>
                    <span className="badge badge-condition" style={{ marginTop: 4 }}>
                      {book.condition}
                    </span>
                  </td>

                  {/* Listing Type */}
                  <td>
                    <span className={`badge ${book.listingType === 'donation' ? 'badge-free' : book.listingType === 'negotiable' ? 'badge-negotiable' : 'badge-fixed'}`}>
                      {book.listingType === 'donation' ? 'Donation' : book.listingType === 'negotiable' ? 'Open to Offers' : 'Fixed Price'}
                    </span>
                  </td>

                  {/* Price */}
                  <td>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--primary-color)' }}>
                      {formatCurrency(book.price)}
                    </strong>
                  </td>

                  {/* Availability Status Selector */}
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', width: 'auto' }}
                      value={book.status}
                      onChange={(e) => changeAvailability(book.id, e.target.value)}
                    >
                      <option value="Available">🟢 Available</option>
                      <option value="Reserved">🟠 Reserved</option>
                      <option value="Donated">🔵 Donated</option>
                      <option value="Sold">🟣 Sold</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link
                        to={`/book/${book.id}`}
                        className="btn btn-ghost btn-sm"
                        title="View Public Listing"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => setEditingBook({ ...book })}
                        className="btn btn-outline btn-sm"
                        title="Edit Book Details"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(book.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#EF4444' }}
                        title="Delete Book"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <Library size={48} color="var(--primary-color)" />
          <h3 className="empty-state-title" style={{ marginTop: '1rem' }}>No books found in this status</h3>
          <p className="empty-state-desc">
            You don't have any books matching the "{statusFilter}" filter right now.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/donate" className="btn btn-primary btn-sm">
              <Gift size={16} /> Donate a Book
            </Link>
            <Link to="/sell" className="btn btn-accent btn-sm">
              <Tag size={16} /> Sell a Book
            </Link>
          </div>
        </div>
      )}

      {/* ================= EDIT BOOK MODAL ================= */}
      {editingBook && (
        <Modal
          isOpen={true}
          onClose={() => setEditingBook(null)}
          title={`Edit "${editingBook.title}"`}
          maxWidth="620px"
          footer={
            <>
              <button onClick={() => setEditingBook(null)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleEditSubmit} className="btn btn-primary">
                Save Changes
              </button>
            </>
          }
        >
          <form onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Book Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Author Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={editingBook.category}
                  onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Condition</label>
                <select
                  className="form-control"
                  value={editingBook.condition}
                  onChange={(e) => setEditingBook({ ...editingBook, condition: e.target.value })}
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {editingBook.listingType !== 'donation' && (
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingBook.price}
                    onChange={(e) => setEditingBook({ ...editingBook, price: e.target.value })}
                    min="1"
                    required
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                value={editingBook.ownerCity}
                onChange={(e) => setEditingBook({ ...editingBook, ownerCity: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={editingBook.description}
                onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                rows={3}
                required
              />
            </div>
          </form>
        </Modal>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Book Listing"
        footer={
          <>
            <button onClick={() => setDeleteConfirmId(null)} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} className="btn btn-danger">
              Yes, Delete Listing
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0' }}>Are you sure you want to delete this listing?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
              This will permanently remove the book from Explore Books, your bookshelf, and any active wishlists.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

