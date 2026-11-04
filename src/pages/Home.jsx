import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Gift,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Repeat,
  Heart,
  BadgeCheck,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useBooks } from '../context/BookContext';
import { BookCard } from '../components/BookCard';
import { CATEGORIES } from '../utils/seedData';

export const Home = () => {
  const { books } = useBooks();
  const navigate = useNavigate();

  // Featured books (up to 4)
  const featuredBooks = books.filter((b) => b.featured).slice(0, 4);

  // Recently added books (newest 4)
  const recentBooks = [...books]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  // Filter categories without 'All'
  const displayCategories = CATEGORIES.filter((c) => c !== 'All');

  return (
    <div className="home-page">
      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-badge">
                <Sparkles size={16} /> Community Book Sharing Platform
              </div>
              <h1 className="hero-heading">
                Every Book Deserves <em>Another Reader</em>.
              </h1>
              <p className="hero-description">
                Give your unused books a new home, discover affordable reads and make knowledge accessible to everyone.
              </p>

              <div className="hero-cta-group">
                <Link to="/explore" className="btn btn-primary btn-lg">
                  <Search size={18} />
                  Explore Books
                </Link>
                <Link to="/donate" className="btn btn-secondary btn-lg">
                  <Gift size={18} />
                  Donate a Book
                </Link>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <h3>2,450+</h3>
                  <p>Books Shared</p>
                </div>
                <div className="stat-item">
                  <h3>₹6.8L+</h3>
                  <p>Saved by Readers</p>
                </div>
                <div className="stat-item">
                  <h3>98%</h3>
                  <p>Happy Exchanges</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / Book Stack Graphic */}
            <div className="hero-visual-card">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span className="badge badge-negotiable" style={{ marginBottom: '0.5rem' }}>
                  Community Spotlight
                </span>
                <h3 style={{ fontSize: '1.35rem', margin: '0.25rem 0' }}>Today's Community Highlights</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Books recirculating between readers right now
                </p>
              </div>

              {featuredBooks.length > 0 && (
                <div style={{ maxWidth: '280px', margin: '0 auto' }}>
                  <BookCard book={featuredBooks[0]} />
                </div>
              )}

              {/* Floating trust badges */}
              <div className="hero-floating-badge hero-floating-badge-1">
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    backgroundColor: 'var(--light-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-color)'
                  }}
                >
                  <Gift size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>100% Free Donations</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Zero platform commission</div>
                </div>
              </div>

              <div className="hero-floating-badge hero-floating-badge-2">
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-dark)'
                  }}
                >
                  <Tag size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Price Negotiation</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Direct buyer & seller offers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section style={{ padding: '4rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Simple, Sustainable & Transparent</div>
            <h2>How BookBridge Works</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              From decluttering your shelves to finding your next favorite book in three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-3" style={{ marginTop: '2rem' }}>
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>List or Donate</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Upload photos of your unused books. Choose to donate for free, set a fixed price, or welcome fair price offers.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <Repeat size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Connect & Negotiate</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Readers send requests or offer prices. Sellers can accept, decline, or make counteroffers with complete transparency.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <Heart size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Read & Pass It On</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Meet locally or arrange delivery. Once done reading, list it back on BookBridge to keep the cycle of knowledge alive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED BOOKS ================= */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-subtitle">Handpicked Community Reads</div>
              <h2>Featured Books</h2>
            </div>
            <Link to="/explore" className="btn btn-outline btn-sm">
              View All Books <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-4">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= BROWSE CATEGORIES ================= */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-surface-alt)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Discover By Subject</div>
            <h2>Popular Book Categories</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Find textbooks, novels, engineering guides, and business bestsellers.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1rem'
            }}
          >
            {displayCategories.map((cat) => {
              const count = books.filter((b) => b.category === cat).length;
              return (
                <div
                  key={cat}
                  onClick={() => navigate(`/explore?category=${encodeURIComponent(cat)}`)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem 0.75rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'var(--primary-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--light-green)',
                      color: 'var(--primary-color)',
                      margin: '0 auto 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <BookOpen size={20} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-color)' }}>
                    {cat}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {count} {count === 1 ? 'book' : 'books'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= RECENTLY ADDED BOOKS ================= */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-subtitle">Fresh On The Shelves</div>
              <h2>Recently Added</h2>
            </div>
            <Link to="/explore?sort=newest" className="btn btn-outline btn-sm">
              Browse Latest <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-4">
            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE BOOKBRIDGE ================= */}
      <section style={{ padding: '4rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">Our Impact & Community Value</div>
            <h2>Why Choose BookBridge?</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Building a circular reading economy that benefits your wallet, your intellect, and the environment.
            </p>
          </div>

          <div className="grid grid-cols-3">
            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--light-green)',
                  color: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <Gift size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Generous Book Donations</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Students and book lovers give away textbooks and novels completely free to passionate readers who cannot afford high retail prices.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Fair Price Negotiation</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Unlike rigid commerce sites, BookBridge empowers buyers and sellers to send real counteroffers and agree on mutually pleasant prices.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--light-green-tint)',
                  color: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Zero Book Waste</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Keep physical pages circulating locally. Prevent thousands of books from gathering dust or ending up in paper scrap yards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: '3.5rem 2.5rem',
              color: '#FFFFFF',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <h2 style={{ color: '#FFFFFF', fontSize: '2.4rem', marginBottom: '1rem' }}>
                Have Books Gathering Dust On Your Shelves?
              </h2>
              <p style={{ color: '#DCE9DD', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                Turn your finished stories and semester textbooks into opportunities for someone else today.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/donate" className="btn btn-accent btn-lg">
                  <Gift size={18} /> Donate a Book Now
                </Link>
                <Link
                  to="/sell"
                  className="btn btn-outline btn-lg"
                  style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}
                >
                  <Tag size={18} /> List for Sale
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

