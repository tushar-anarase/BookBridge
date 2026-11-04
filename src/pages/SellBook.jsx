import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, DollarSign, ArrowRightLeft, Upload, Sparkles, AlertCircle } from 'lucide-react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES, CONDITIONS } from '../utils/seedData';
import { fileToBase64, getFallbackCover } from '../utils/helpers';

export const SellBook = () => {
  const navigate = useNavigate();
  const { addBook } = useBooks();
  const { currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [sellingType, setSellingType] = useState('fixed'); // 'fixed' or 'negotiable'

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Business',
    condition: 'Like New',
    price: '',
    language: 'English',
    pages: '',
    publishedYear: '',
    location: currentUser?.city || '',
    description: '',
    coverImage: ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample curated book cover presets for quick selection
  const sampleCovers = [
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (!file) return;

    try {
      const base64 = await fileToBase64(file, 1.5);
      setImagePreview(base64);
      setFormData((prev) => ({ ...prev, coverImage: base64 }));
    } catch (err) {
      setImageError(err.message || 'Error processing image');
      showToast(err.message || 'Image upload failed', 'error');
    }
  };

  const handleSelectSampleCover = (url) => {
    setImagePreview(url);
    setImageError('');
    setFormData((prev) => ({ ...prev, coverImage: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in before selling a book', 'warning');
      navigate('/login');
      return;
    }

    // Validation
    if (!formData.title.trim() || !formData.author.trim() || !formData.description.trim()) {
      showToast('Please complete all required fields (*)', 'error');
      return;
    }

    const numericPrice = Number(formData.price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      showToast('Please enter a valid price in INR (> 0)', 'error');
      return;
    }

    setIsSubmitting(true);

    const finalCover =
      formData.coverImage ||
      imagePreview ||
      getFallbackCover(formData.title, formData.author);

    const newBook = addBook({
      ...formData,
      listingType: sellingType,
      price: numericPrice,
      coverImage: finalCover
    });

    setIsSubmitting(false);

    if (newBook) {
      navigate('/bookshelf');
    }
  };

  return (
    <div className="container main-content">
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent-dark)',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <DollarSign size={28} />
          </div>
          <h1>Sell a Second-Hand Book</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0.5rem auto 0' }}>
            List your gently read books for sale. Choose fixed price or invite friendly negotiations from fellow readers.
          </p>
        </div>

        {/* Selling Mode Selection Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div
            onClick={() => setSellingType('fixed')}
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${sellingType === 'fixed' ? 'var(--primary-color)' : 'var(--border-color)'}`,
              backgroundColor: sellingType === 'fixed' ? '#FFFFFF' : 'var(--bg-surface-alt)',
              cursor: 'pointer',
              boxShadow: sellingType === 'fixed' ? 'var(--shadow-md)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.5rem' }}>
              <Tag size={20} color="var(--primary-color)" />
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary-color)' }}>
                Option A: Fixed Price
              </strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Set your expected price. Buyers cannot counteroffer and send direct purchase requests.
            </p>
          </div>

          <div
            onClick={() => setSellingType('negotiable')}
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${sellingType === 'negotiable' ? 'var(--accent-color)' : 'var(--border-color)'}`,
              backgroundColor: sellingType === 'negotiable' ? '#FFFFFF' : 'var(--bg-surface-alt)',
              cursor: 'pointer',
              boxShadow: sellingType === 'negotiable' ? 'var(--shadow-md)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.5rem' }}>
              <ArrowRightLeft size={20} color="var(--accent-dark)" />
              <strong style={{ fontSize: '1.05rem', color: 'var(--accent-dark)' }}>
                Option B: Open to Offers
              </strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Set your asking price. Buyers can propose counteroffers for you to accept, decline, or counter.
            </p>
          </div>
        </div>

        {/* Sell Form Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Title & Author */}
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">
                  Book Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Atomic Habits"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Author Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  className="form-control"
                  placeholder="e.g. James Clear"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Price & Location */}
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">
                  Expected Price (₹ INR) <span className="required">*</span>
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
                    name="price"
                    className="form-control"
                    style={{ paddingLeft: '2rem' }}
                    placeholder="e.g. 250"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
                <span className="form-help">
                  {sellingType === 'negotiable'
                    ? 'This is your benchmark starting price.'
                    : 'Buyers will purchase at this exact price.'}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Pickup City / Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="e.g. Delhi NCR, Saket"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-3">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Condition</label>
                <select
                  name="condition"
                  className="form-control"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Language</label>
                <input
                  type="text"
                  name="language"
                  className="form-control"
                  placeholder="English"
                  value={formData.language}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Description & Edition Details <span className="required">*</span>
              </label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Mention book edition, cover type (hardcover/paperback), notes, markings, or reason for selling..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">Book Cover Photo</label>
              <div
                style={{
                  border: '2px dashed var(--border-darker)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-color)'
                }}
              >
                <input
                  type="file"
                  id="sell-cover-input"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="sell-cover-input" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                  <Upload size={16} /> Choose Image from Device
                </label>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  PNG, JPG, WebP up to 1.5MB
                </p>

                {imageError && (
                  <div className="form-error" style={{ marginTop: '0.5rem' }}>
                    <AlertCircle size={14} style={{ display: 'inline', marginRight: 4 }} />
                    {imageError}
                  </div>
                )}

                {/* Sample Preset Selection */}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Or select a curated cover:
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '0.5rem' }}>
                    {sampleCovers.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="Sample cover"
                        onClick={() => handleSelectSampleCover(url)}
                        style={{
                          width: 44,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 4,
                          cursor: 'pointer',
                          border: imagePreview === url ? '2px solid var(--accent-dark)' : '1px solid var(--border-color)'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {imagePreview && (
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    style={{ width: 64, height: 90, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                      ✓ Cover image selected
                    </span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Will be shown on the marketplace card.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-accent btn-lg"
                disabled={isSubmitting}
              >
                <Tag size={18} /> Publish Book Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

