import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Upload, Sparkles, AlertCircle, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES, CONDITIONS } from '../utils/seedData';
import { fileToBase64, getFallbackCover } from '../utils/helpers';

export const DonateBook = () => {
  const navigate = useNavigate();
  const { addBook } = useBooks();
  const { currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Fiction',
    condition: 'Good',
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
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80'
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
      showToast('Please log in before donating a book', 'warning');
      navigate('/login');
      return;
    }

    // Validation
    if (!formData.title.trim() || !formData.author.trim() || !formData.description.trim()) {
      showToast('Please fill out all required fields (*)', 'error');
      return;
    }

    setIsSubmitting(true);

    const finalCover =
      formData.coverImage ||
      imagePreview ||
      getFallbackCover(formData.title, formData.author);

    const newBook = addBook({
      ...formData,
      listingType: 'donation',
      price: 0,
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
        {/* Header banner */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--light-green)',
              color: 'var(--primary-color)',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Gift size={28} />
          </div>
          <h1>Donate a Book for Free</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0.5rem auto 0' }}>
            Give your loved books a new chapter in another reader's journey. Donated books are listed as <strong>FREE</strong> for students and community readers.
          </p>
        </div>

        {/* Donation Form Card */}
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
                  placeholder="e.g. Sapiens: A Brief History of Humankind"
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
                  placeholder="e.g. Yuval Noah Harari"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Category, Condition, Language */}
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
                  placeholder="English, Hindi, etc."
                  value={formData.language}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Location & Optional Metadata */}
            <div className="grid grid-cols-3">
              <div className="form-group">
                <label className="form-label">
                  Pickup City / Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="e.g. Bengaluru, Indiranagar"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pages (Optional)</label>
                <input
                  type="number"
                  name="pages"
                  className="form-control"
                  placeholder="e.g. 320"
                  value={formData.pages}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Year Published (Optional)</label>
                <input
                  type="number"
                  name="publishedYear"
                  className="form-control"
                  placeholder="e.g. 2018"
                  value={formData.publishedYear}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Description & Book Condition Details <span className="required">*</span>
              </label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Share why you are donating, condition of pages/spine, why you recommend this book, pickup preferences..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            {/* Cover Image Upload & Presets */}
            <div className="form-group">
              <label className="form-label">
                Book Cover Photo
              </label>
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
                  id="book-cover-input"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="book-cover-input" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
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

                {/* Or Choose Sample Cover */}
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
                          border: imagePreview === url ? '2px solid var(--primary-color)' : '1px solid var(--border-color)'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
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
                      This image will be displayed on the Explore Books card and Details page.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Donation Badge Reminder */}
            <div
              style={{
                padding: '0.85rem 1.25rem',
                backgroundColor: 'var(--light-green-tint)',
                border: '1px solid var(--light-green)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--primary-color)'
              }}
            >
              <Sparkles size={18} />
              <span>
                <strong>Good karma guaranteed!</strong> This book will be listed with a <strong>FREE</strong> badge.
              </span>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
              >
                <Gift size={18} /> Complete Book Donation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

