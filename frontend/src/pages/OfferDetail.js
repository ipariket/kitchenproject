/**
 * OfferDetail.js — Single food offer detail page.
 *
 * From your offer.html: shows dish name, kitchen, cuisine, pickup time,
 * dietary info, quantity, and a "Claim Offer" button.
 *
 * useParams() extracts the :id from the URL (e.g. /offer/3 → id = "3").
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../App';

const styles = {
  page: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '32px 20px',
  },
  card: {
    background: '#fffdf8',
    border: '1px solid #ddd2bf',
    borderRadius: 18,
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    animation: 'fadeIn 0.4s ease-out',
  },
  imageWrap: {
    width: '100%',
    height: 280,
    background: 'linear-gradient(135deg, #ece4d6, #f5efe3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 80,
  },
  image: {
    width: '100%',
    height: 280,
    objectFit: 'cover',
  },
  body: {
    padding: '28px 32px',
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 28,
    fontWeight: 700,
    color: '#1f5c3f',
    marginBottom: 8,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px 24px',
    marginBottom: 20,
  },
  metaItem: {
    fontSize: 14,
  },
  metaLabel: {
    fontWeight: 700,
    color: '#333',
  },
  metaValue: {
    color: '#555',
    marginLeft: 6,
  },
  tags: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    padding: '4px 12px',
    borderRadius: 16,
    fontSize: 12,
    fontWeight: 600,
    background: '#e8f5e9',
    color: '#1f5c3f',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 700,
    color: '#1f5c3f',
  },
  quantity: {
    fontSize: 14,
    color: '#555',
    background: '#faf6ee',
    padding: '6px 14px',
    borderRadius: 10,
    border: '1px solid #ddd2bf',
  },
  btn: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: '#1f5c3f',
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.2s, transform 0.15s',
  },
  kitchenLink: {
    display: 'inline-block',
    marginTop: 16,
    padding: '10px 20px',
    borderRadius: 10,
    border: '1px solid #ddd2bf',
    background: '#fffdf8',
    color: '#1f5c3f',
    fontWeight: 600,
    fontSize: 14,
    textDecoration: 'none',
    transition: 'all 0.15s',
  },
  success: {
    background: '#e8f5e9',
    border: '1px solid #4ade80',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#166534',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
};

function OfferDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    // TODO: Replace with real API call: getProduct(id)
    // Mock data
    const mockProducts = {
      1: { id: 1, name: 'Chicken Tikka', price: 12.99, quantity: 3, pickup_time: '6:00 PM',
           dietary_info: 'Halal', restaurant: { id: 1, name: 'Spice Corner', cuisine: 'Indian' },
           tags: [{ id: 4, name: 'Indian' }, { id: 8, name: 'Halal' }], image: null },
      2: { id: 2, name: 'Veggie Pasta', price: 9.50, quantity: 5, pickup_time: '5:30 PM',
           dietary_info: 'Vegetarian', restaurant: { id: 2, name: 'Sunny Spoon Kitchen', cuisine: 'Italian' },
           tags: [{ id: 3, name: 'Italian' }, { id: 7, name: 'Vegetarian' }], image: null },
      3: { id: 3, name: 'Banana Bread', price: 5.00, quantity: 8, pickup_time: '3:00 PM',
           dietary_info: 'Vegetarian', restaurant: { id: 3, name: 'Grandma Bakes', cuisine: 'Bakery' },
           tags: [{ id: 7, name: 'Vegetarian' }], image: null },
    };
    setProduct(mockProducts[id] || mockProducts[1]);
  }, [id]);

  const getEmoji = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('chicken')) return '🍗';
    if (lower.includes('pasta')) return '🍝';
    if (lower.includes('bread')) return '🍞';
    if (lower.includes('salad')) return '🥗';
    return '🍽️';
  };

  if (!product) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={styles.image} />
        ) : (
          <div style={styles.imageWrap}>{getEmoji(product.name)}</div>
        )}

        <div style={styles.body}>
          <h1 style={styles.title}>{product.name}</h1>

          <div style={styles.tags}>
            {product.tags?.map(tag => (
              <span key={tag.id} style={styles.tag}>{tag.name}</span>
            ))}
          </div>

          <div style={styles.meta}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Kitchen:</span>
              <span style={styles.metaValue}>{product.restaurant?.name}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Cuisine:</span>
              <span style={styles.metaValue}>{product.restaurant?.cuisine}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Pickup:</span>
              <span style={styles.metaValue}>{product.pickup_time}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Dietary:</span>
              <span style={styles.metaValue}>{product.dietary_info}</span>
            </div>
          </div>

          <div style={styles.priceRow}>
            <span style={styles.price}>${Number(product.price).toFixed(2)}</span>
            <span style={styles.quantity}>{product.quantity} left</span>
          </div>

          {claimed ? (
            <div style={styles.success}>
              Order placed successfully! Pick up at {product.pickup_time}.
            </div>
          ) : (
            <button
              style={styles.btn}
              onClick={() => {
                if (!user) {
                  alert('Please login to claim this offer');
                  return;
                }
                setClaimed(true);
                // TODO: createOrder({ product_id: product.id, quantity: 1 })
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#2d7a53';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#1f5c3f';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🛒 Claim Offer
            </button>
          )}

          <Link
            to={`/kitchen/${product.restaurant?.id || 1}`}
            style={styles.kitchenLink}
          >
            View {product.restaurant?.name}'s Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OfferDetail;
