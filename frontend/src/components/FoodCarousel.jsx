/**
 * FoodCarousel.js — Horizontal auto-scrolling food carousel.
 *
 * Ported from your newKitchen.html carousel:
 *   - Auto-scrolls every 3 seconds
 *   - Pauses on hover (mouseenter/mouseleave)
 *   - Left/right arrow buttons for manual scrolling
 *   - Wraps around to the beginning when reaching the end
 *   - Uses scroll-snap for smooth card alignment
 *
 * Props:
 *   items: array of product objects to display
 *   onItemClick: callback when a card is clicked
 *
 * Key React concepts used:
 *   useRef: gets a direct reference to the DOM element (for scrolling)
 *   useEffect: sets up the auto-scroll timer (and cleans it up)
 *   useCallback: memoizes the scroll function to prevent unnecessary re-renders
 */

import React, { useRef, useEffect, useCallback } from 'react';

const styles = {
  // Outer wrapper with green background (from newKitchen.html .horizontal-section)
  wrapper: {
    background: 'linear-gradient(135deg, #1f5c3f 0%, #2d7a53 100%)',
    borderRadius: 18,
    padding: '24px 16px',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 24,
  },
  // Section heading inside the carousel
  heading: {
    color: '#fff',
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
    paddingLeft: 8,
  },
  // Scrollable container for cards
  container: {
    display: 'flex',
    gap: 16,
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    scrollSnapType: 'x mandatory',  // Cards snap into position when scrolling
    paddingBottom: 8,
    // Hide the scrollbar visually
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  // Individual food card
  card: {
    flex: '0 0 220px',            // Fixed width, won't shrink
    background: '#fffdf8',
    borderRadius: 14,
    padding: 0,
    textAlign: 'center',
    scrollSnapAlign: 'center',    // Snaps to center when scrolling
    cursor: 'pointer',
    transition: 'transform 0.25s, box-shadow 0.25s',
    overflow: 'hidden',
    border: '1px solid #ddd2bf',
  },
  // Food image area
  cardImage: {
    width: '100%',
    height: 140,
    objectFit: 'cover',           // Crop to fill without stretching
    background: '#ece4d6',
  },
  // Placeholder when no image (shows emoji)
  cardPlaceholder: {
    width: '100%',
    height: 140,
    background: 'linear-gradient(135deg, #ece4d6 0%, #f5efe3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
  },
  cardBody: {
    padding: '12px 14px',
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: 15,
    color: '#111',
    marginBottom: 4,
    // Truncate long names with ellipsis
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardMeta: {
    color: '#555',
    fontSize: 12,
    marginBottom: 6,
  },
  cardPrice: {
    fontWeight: 700,
    fontSize: 16,
    color: '#1f5c3f',
  },
  // Arrow buttons (from newKitchen.html .arrow)
  arrow: {
    position: 'absolute',
    top: '55%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.95)',
    border: 'none',
    width: 36,
    height: 36,
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 2,
    transition: 'transform 0.15s',
  },
};

function FoodCarousel({ items = [], onItemClick }) {
  // useRef gives us direct access to the scrollable container DOM element
  // This lets us call .scrollBy() and .scrollTo() directly
  const containerRef = useRef(null);
  // useRef for the interval ID so we can clear it on unmount
  const intervalRef = useRef(null);

  /**
   * scrollCards: scrolls the container by one card width.
   * direction: 1 = right, -1 = left
   *
   * useCallback memoizes this function so it doesn't get recreated
   * on every render (performance optimization).
   */
  const scrollCards = useCallback((direction) => {
    const container = containerRef.current;
    if (!container) return;
    // Calculate one card's width + gap for scroll distance
    const cardWidth = 220 + 16;  // card flex-basis + gap
    container.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  }, []);

  /**
   * startAutoScroll: begins the 3-second auto-scroll timer.
   * When the scroll reaches the end, it wraps back to the beginning.
   */
  const startAutoScroll = useCallback(() => {
    intervalRef.current = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      // Check if we've scrolled to the end
      // scrollLeft + clientWidth >= scrollWidth means we're at the right edge
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        // Wrap back to the beginning
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll one card to the right
        container.scrollBy({ left: 236, behavior: 'smooth' });
      }
    }, 3000);  // Every 3 seconds (from newKitchen.html)
  }, []);

  /**
   * stopAutoScroll: clears the timer (pauses scrolling).
   */
  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Set up auto-scroll on mount, clean up on unmount ──
  useEffect(() => {
    if (items.length > 3) {
      startAutoScroll();
    }
    // Cleanup function: React calls this when the component unmounts
    // or before re-running the effect. Prevents memory leaks.
    return () => stopAutoScroll();
  }, [items.length, startAutoScroll, stopAutoScroll]);

  // Don't render if no items
  if (items.length === 0) return null;

  return (
    <div
      style={styles.wrapper}
      // Pause auto-scroll on hover (from newKitchen.html)
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      <div style={styles.heading}>🔥 Today's Picks</div>

      {/* Left arrow */}
      <button
        style={{ ...styles.arrow, left: 10 }}
        onClick={() => scrollCards(-1)}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-50%) scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(-50%)'}
        aria-label="Scroll left"
      >
        ◀
      </button>

      {/* Right arrow */}
      <button
        style={{ ...styles.arrow, right: 10 }}
        onClick={() => scrollCards(1)}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-50%) scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(-50%)'}
        aria-label="Scroll right"
      >
        ▶
      </button>

      {/* Scrollable cards container */}
      <div ref={containerRef} style={styles.container}>
        {items.map((item, index) => (
          <div
            key={item.id || index}
            style={styles.card}
            onClick={() => onItemClick && onItemClick(item)}
            // Hover effect: lift and shadow
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Show food image if available, otherwise emoji placeholder */}
            {item.image ? (
              <img src={item.image} alt={item.name} style={styles.cardImage} />
            ) : (
              <div style={styles.cardPlaceholder}>
                {item.emoji || '🍽️'}
              </div>
            )}
            <div style={styles.cardBody}>
              <div style={styles.cardTitle}>{item.name}</div>
              <div style={styles.cardMeta}>
                {item.restaurant?.name || 'Kitchen'} • {item.dietary_info || 'Pickup'}
              </div>
              {item.price > 0 && (
                <div style={styles.cardPrice}>${Number(item.price).toFixed(2)}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoodCarousel;
