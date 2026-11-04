import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { useBooks } from '../context/BookContext';
import { BookOpen, SlidersHorizontal, X } from 'lucide-react';

export const ExploreBooks = () => {
  const { books } = useBooks();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const sort = searchParams.get('sort');
    if (sort) setSortBy(sort);
  }, [searchParams]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedType('all');
    setSelectedCondition('All');
    setSortBy('newest');
    setSearchParams({});
  };

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search query: title or author
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = book.title?.toLowerCase().includes(q);
          const matchAuthor = book.author?.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor) return false;
        }

        // Category
        if (selectedCategory !== 'All' && book.category !== selectedCategory) {
          return false;
        }

        // Listing Type / Price model
        if (selectedType === 'donation' && book.listingType !== 'donation') {
          return false;
        }
        if (selectedType === 'fixed' && book.listingType !== 'fixed') {
          return false;
        }
        if (selectedType === 'negotiable' && book.listingType !== 'negotiable') {
          return false;
        }

        // Condition
        if (selectedCondition !== 'All' && book.condition !== selectedCondition) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === 'price_low') {
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        }
        if (sortBy === 'price_high') {
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [books, searchQuery, selectedCategory, selectedType, selectedCondition, sortBy]);

  return (
    <div className="container main-content">
      {/* Header & Search */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Explore Books</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Discover available books from readers in your community. Request donations or make purchase offers.
        </p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search by book title or author..."
            />
          </div>

          <button
            className="btn btn-outline"
            style={{ display: 'none' }} /* will be shown via media query or button */
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Book Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '2rem',
          alignItems: 'start'
        }}
        className="explore-layout"
      >
        {/* Left Filter Sidebar */}
        <aside>
          <FilterPanel
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            selectedCondition={selectedCondition}
            onSelectCondition={setSelectedCondition}
            sortBy={sortBy}
            onSelectSort={setSortBy}
            onResetFilters={handleResetFilters}
            totalResults={filteredBooks.length}
          />
        </aside>

        {/* Right Book Cards Grid */}
        <main>
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-3">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <BookOpen size={36} />
              </div>
              <h3 className="empty-state-title">No books match your filters</h3>
              <p className="empty-state-desc">
                We couldn't find any books matching "{searchQuery || selectedCategory}". Try selecting another category or resetting filters.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary">
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .explore-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

