/**
 * FoodCard.js — A single food listing card.
 *
 * Matches the .card styling from your styles.css:
 *   - Beige background (#fffdf8) with border
 *   - Food image/emoji on the left
 *   - Title, restaurant name, meta info on the right
 *   - Hover lift effect
 *
 * Props:
 *   product: the food item object from the API
 *   onClick: callback when the card is clicked
 *
 * This is a "presentational component" — it just displays data passed as props.
 * It doesn't fetch data or manage state (that's the parent's job).
 */

import React from 'react';

const styles = {
  card: {
    background: '#fffdf8',
    border: '1px solid #ddd2bf',
    borderRadius: 14,
    padding: 14,
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    // Fade-in animation
    animation: 'fadeIn 0.4s ease-out both',
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    flexShrink: 0,
    background: '#ece4d6',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    background: 'linear-gradient(135deg, #ece4d6, #f5efe3)',
  },
  content: {
    flex: 1,
    minWidth: 0,  // Allows text truncation to work inside flex
  },
  title: {
    fontWeight: 700,
    fontSize: 15,
    color: '#111',
    marginBottom: 4,
    // Truncate with ellipsis if too long
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    color: '#555',
    fontSize: 13,
    marginBottom: 4,
  },
  tags: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 6,
  },
  tag: {
    padding: '2px 8px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    background: '#e8f5e9',
    color: '#1f5c3f',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  price: {
    fontWeight: 700,
    fontSize: 16,
    color: '#1f5c3f',
  },
  quantity: {
    fontSize: 12,
    color: '#555',
    background: '#faf6ee',
    padding: '2px 8px',
    borderRadius: 10,
  },
};

function FoodCard({ product, onClick }) {
  // Map common food types to emojis for placeholder images
  const getEmoji = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('chicken') || lower.includes('tikka')) return '🍗';
    if (lower.includes('pasta') || lower.includes('noodle')) return '🍝';
    if (lower.includes('bread') || lower.includes('bake')) return '🍞';
    if (lower.includes('salad') || lower.includes('veg')) return '🥗';
    if (lower.includes('pizza')) return '🍕';
    if (lower.includes('sushi') || lower.includes('fish')) return '🍣';
    if (lower.includes('taco') || lower.includes('mexican')) return '🌮';
    if (lower.includes('burger')) return '🍔';
    if (lower.includes('rice') || lower.includes('bowl')) return '🍚';
    if (lower.includes('soup')) return '🍜';
    if (lower.includes('cake') || lower.includes('dessert')) return '🍰';
    return '🍽️';  // Default food emoji
  };

  return (
    <div
      style={styles.card}
      onClick={() => onClick && onClick(product)}
      // Hover: lift card and add shadow
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Food image or emoji placeholder */}
      <div style={styles.imageWrap}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={styles.image} />
        ) : (
          <div style={styles.placeholder}>
            {getEmoji(product.name)}
          </div>
        )}
      </div>

      {/* Card text content */}
      <div style={styles.content}>
        <div style={styles.title}>{product.name}</div>
        <div style={styles.meta}>
          {/* Restaurant name • cuisine • pickup time */}
          {product.restaurant?.name || 'Kitchen'}
          {product.restaurant?.cuisine && ` • ${product.restaurant.cuisine}`}
          {product.pickup_time && ` • Pickup ${product.pickup_time}`}
        </div>

        {/* Tags (if any) */}
        {product.tags && product.tags.length > 0 && (
          <div style={styles.tags}>
            {product.tags.map((tag) => (
              <span key={tag.id} style={styles.tag}>{tag.name}</span>
            ))}
          </div>
        )}

        {/* Price and quantity row */}
        <div style={styles.priceRow}>
          {product.price > 0 && (
            <span style={styles.price}>${Number(product.price).toFixed(2)}</span>
          )}
          {product.quantity > 0 && (
            <span style={styles.quantity}>{product.quantity} left</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
