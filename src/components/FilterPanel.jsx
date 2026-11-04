import React from 'react';
import { RotateCcw, Filter, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, CONDITIONS } from '../utils/seedData';

export const FilterPanel = ({
  selectedCategory,
  onSelectCategory,
  selectedType,
  onSelectType,
  selectedCondition,
  onSelectCondition,
  sortBy,
  onSelectSort,
  onResetFilters,
  totalResults
}) => {
  const listingTypes = [
    { id: 'all', label: 'All Listings' },
    { id: 'donation', label: 'FREE Donation' },
    { id: 'fixed', label: 'Fixed Price' },
    { id: 'negotiable', label: 'Open to Offers' }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'price_low', label: 'Price: Low to High' },
    { id: 'price_high', label: 'Price: High to Low' },
    { id: 'title', label: 'Title: A to Z' }
  ];

  return (
    <div className="filter-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.1rem' }}>
          <SlidersHorizontal size={18} color="var(--primary-color)" />
          Filters & Sort
        </h4>
        <button
          onClick={onResetFilters}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
          title="Reset all filters"
        >
          <RotateCcw size={13} style={{ marginRight: 4 }} />
          Reset
        </button>
      </div>

      {/* Listing Type / Free vs Paid */}
      <div className="filter-section">
        <div className="filter-title">Type & Price Model</div>
        <div className="filter-pill-list">
          {listingTypes.map((type) => (
            <button
              key={type.id}
              className={`filter-pill ${selectedType === type.id ? 'active' : ''}`}
              onClick={() => onSelectType(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="filter-section">
        <div className="filter-title">Category</div>
        <div className="filter-pill-list">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Book Condition */}
      <div className="filter-section">
        <div className="filter-title">Condition</div>
        <div className="filter-pill-list">
          <button
            className={`filter-pill ${selectedCondition === 'All' ? 'active' : ''}`}
            onClick={() => onSelectCondition('All')}
          >
            All Conditions
          </button>
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              className={`filter-pill ${selectedCondition === cond ? 'active' : ''}`}
              onClick={() => onSelectCondition(cond)}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="filter-section">
        <div className="filter-title">Sort By</div>
        <div className="filter-pill-list">
          {sortOptions.map((opt) => (
            <button
              key={opt.id}
              className={`filter-pill ${sortBy === opt.id ? 'active' : ''}`}
              onClick={() => onSelectSort(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {typeof totalResults === 'number' && (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '0.75rem' }}>
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'book' : 'books'}
        </div>
      )}
    </div>
  );
};

