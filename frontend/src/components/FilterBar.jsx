/**
 * FilterBar.js — Search filters for food listings.
 *
 * Ported from newKitchen.html:
 *   - Cuisine tag chips (Mexican, Chinese, Italian, etc.)
 *   - Price range slider
 *   - Click to toggle filter dropdown
 *
 * Props:
 *   tags: array of { id, name } tag objects from the API
 *   selectedTags: array of selected tag IDs
 *   onTagToggle: callback when a tag chip is clicked
 *   priceRange: [min, max] current price filter
 *   onPriceChange: callback when price slider changes
 *   onApply: callback when "Apply Filters" is clicked
 *
 * Key React concepts:
 *   useState: controls dropdown visibility
 *   Controlled components: slider value is driven by React state
 */

import React, { useState } from 'react';

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '10px 16px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    border: '1px solid #c8bea9',
    background: '#fffdf8',
    color: '#1f5c3f',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    background: '#fffdf8',
    border: '1px solid #ddd2bf',
    borderRadius: 14,
    padding: 16,
    zIndex: 20,
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    minWidth: 320,
    // Entry animation
    animation: 'scaleIn 0.2s ease-out',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#555',
    marginBottom: 10,
  },
  tagGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid #ddd2bf',
    background: '#faf6ee',
    color: '#333',
    transition: 'all 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  },
  tagActive: {
    background: '#1f5c3f',
    color: '#fff',
    borderColor: '#1f5c3f',
  },
  sliderWrap: {
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    accentColor: '#1f5c3f',   // Thumb and track color
    cursor: 'pointer',
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  applyBtn: {
    width: '100%',
    padding: '10px',
    borderRadius: 10,
    border: 'none',
    background: '#1f5c3f',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.15s',
  },
  // Quick-access tag chips shown before the dropdown
  quickTags: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickTag: {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid #ddd2bf',
    background: '#fffdf8',
    color: '#333',
    transition: 'all 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  },
};

function FilterBar({
  tags = [],
  selectedTags = [],
  onTagToggle,
  priceRange = [1, 100],
  onPriceChange,
  onApply,
}) {
  // Controls whether the filter dropdown is visible
  const [showDropdown, setShowDropdown] = useState(false);

  // Default cuisine tags shown as quick-access chips even before API tags load
  const defaultCuisines = ['Mexican', 'Chinese', 'Italian', 'Indian', 'Thai', 'Healthy'];

  return (
    <div style={styles.wrapper}>
      {/* Quick-access cuisine chips (always visible) */}
      <div style={styles.quickTags}>
        {defaultCuisines.map((cuisine) => (
          <span
            key={cuisine}
            style={{
              ...styles.quickTag,
              // Highlight if this cuisine tag is selected
              ...(selectedTags.includes(cuisine) ? styles.tagActive : {}),
            }}
            onClick={() => onTagToggle && onTagToggle(cuisine)}
            onMouseEnter={(e) => {
              if (!selectedTags.includes(cuisine)) {
                e.target.style.borderColor = '#1f5c3f';
                e.target.style.color = '#1f5c3f';
              }
            }}
            onMouseLeave={(e) => {
              if (!selectedTags.includes(cuisine)) {
                e.target.style.borderColor = '#ddd2bf';
                e.target.style.color = '#333';
              }
            }}
          >
            {cuisine}
          </span>
        ))}
      </div>

      {/* Filter button with dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          style={styles.filterBtn}
          onClick={() => setShowDropdown(!showDropdown)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1f5c3f';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fffdf8';
            e.currentTarget.style.color = '#1f5c3f';
          }}
        >
          ⚙️ Filters
        </button>

        {/* Dropdown panel (from newKitchen.html .dropdown) */}
        {showDropdown && (
          <div style={styles.dropdown}>
            {/* Tag selection */}
            <div style={styles.sectionTitle}>Categories</div>
            <div style={styles.tagGrid}>
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    ...styles.tag,
                    ...(selectedTags.includes(tag.id) ? styles.tagActive : {}),
                  }}
                  onClick={() => onTagToggle && onTagToggle(tag.id)}
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* Price range slider */}
            <div style={styles.sectionTitle}>
              Price Range: ${priceRange[0]} – ${priceRange[1]}
            </div>
            <div style={styles.sliderWrap}>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={priceRange[1]}
                onChange={(e) =>
                  onPriceChange && onPriceChange([priceRange[0], parseInt(e.target.value)])
                }
                style={styles.slider}
              />
              <div style={styles.sliderLabels}>
                <span>$1</span>
                <span>$25</span>
                <span>$50</span>
                <span>$75</span>
                <span>$100</span>
              </div>
            </div>

            {/* Apply button */}
            <button
              style={styles.applyBtn}
              onClick={() => {
                onApply && onApply();
                setShowDropdown(false);  // Close dropdown after applying
              }}
              onMouseEnter={(e) => e.target.style.background = '#2d7a53'}
              onMouseLeave={(e) => e.target.style.background = '#1f5c3f'}
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterBar;
