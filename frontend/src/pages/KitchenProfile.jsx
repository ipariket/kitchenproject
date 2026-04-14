/**
 * KitchenProfile.js — Restaurant/Kitchen profile page.
 *
 * From your kitchen.html: shows kitchen name, about section,
 * rating, and available food items.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FoodCard from '../components/FoodCard';

const styles = {
  page: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '32px 20px',
    animation: 'fadeIn 0.4s ease-out',
  },
  header: {
    background: 'linear-gradient(135deg, #1f5c3f, #2d7a53)',
    borderRadius: 18,
    padding: '32px',
    color: '#fff',
    marginBottom: 24,
  },
  name: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
  },
  cuisine: {
    fontSize: 14,
    opacity: 0.85,
    marginBottom: 12,
  },
  rating: {
    fontSize: 18,
    fontWeight: 600,
  },
  about: {
    background: '#fffdf8',
    border: '1px solid #ddd2bf',
    borderRadius: 14,
    padding: '20px',
    marginBottom: 24,
  },
  aboutTitle: {
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 8,
  },
  aboutText: {
    color: '#555',
    fontSize: 14,
    lineHeight: 1.6,
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 20,
    fontWeight: 700,
    color: '#1f5c3f',
    marginBottom: 16,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
};

function KitchenProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // TODO: Replace with real API calls
    const mockRestaurants = {
      1: { id: 1, name: 'Spice Corner', cuisine: 'Indian', rating: 4.8,
           description: 'Authentic Indian cuisine with a modern twist. Fresh spices imported weekly.' },
      2: { id: 2, name: 'Sunny Spoon Kitchen', cuisine: 'Italian', rating: 4.6,
           description: 'Homemade Italian-style meals prepared fresh for local pickup.' },
      3: { id: 3, name: 'Grandma Bakes', cuisine: 'Bakery', rating: 4.9,
           description: 'Old-fashioned recipes baked with love every morning.' },
    };
    const mockProducts = {
      1: [
        { id: 1, name: 'Chicken Tikka', price: 12.99, quantity: 3, pickup_time: '6:00 PM',
          dietary_info: 'Halal', restaurant: mockRestaurants[1], tags: [{ id: 4, name: 'Indian' }] },
      ],
      2: [
        { id: 2, name: 'Veggie Pasta', price: 9.50, quantity: 5, pickup_time: '5:30 PM',
          dietary_info: 'Vegetarian', restaurant: mockRestaurants[2], tags: [{ id: 3, name: 'Italian' }] },
        { id: 4, name: 'Fresh Salad Bowl', price: 8.75, quantity: 4, pickup_time: '6:00 PM',
          dietary_info: 'Vegan', restaurant: mockRestaurants[2], tags: [{ id: 6, name: 'Healthy' }] },
      ],
      3: [
        { id: 3, name: 'Banana Bread', price: 5.00, quantity: 8, pickup_time: '3:00 PM',
          dietary_info: 'Vegetarian', restaurant: mockRestaurants[3], tags: [{ id: 7, name: 'Vegetarian' }] },
      ],
    };

    setRestaurant(mockRestaurants[id] || mockRestaurants[2]);
    setProducts(mockProducts[id] || mockProducts[2]);
  }, [id]);

  if (!restaurant) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.name}>{restaurant.name}</div>
        <div style={styles.cuisine}>{restaurant.cuisine} Cuisine</div>
        <div style={styles.rating}>⭐ {restaurant.rating} / 5</div>
      </div>

      <div style={styles.about}>
        <div style={styles.aboutTitle}>About This Kitchen</div>
        <p style={styles.aboutText}>{restaurant.description}</p>
      </div>

      <h2 style={styles.sectionTitle}>Available Now</h2>
      <div style={styles.list}>
        {products.map(product => (
          <FoodCard
            key={product.id}
            product={product}
            onClick={() => navigate(`/offer/${product.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default KitchenProfile;
