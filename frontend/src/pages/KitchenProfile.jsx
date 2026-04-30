import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import useWindowSize from '../components/useWindowSize';

const R = { 1: { name: 'Spice Corner', cuisine: 'Indian', rating: 4.8, desc: 'Authentic Indian cuisine.' }, 2: { name: 'Sunny Spoon Kitchen', cuisine: 'Italian', rating: 4.6, desc: 'Homemade Italian meals.' }, 3: { name: 'Grandma Bakes', cuisine: 'Bakery', rating: 4.9, desc: 'Old-fashioned baked goods.' } };
const P = {
  1: [{ id: 1, name: 'Chicken Tikka', price: 12.99, quantity: 3, pickup_time: '6:00 PM', restaurant: R[1], tags: [{ id: 4, name: 'Indian' }] }],
  2: [{ id: 2, name: 'Veggie Pasta', price: 9.50, quantity: 5, pickup_time: '5:30 PM', restaurant: R[2], tags: [{ id: 3, name: 'Italian' }] }, { id: 4, name: 'Fresh Salad', price: 8.75, quantity: 4, pickup_time: '6:00 PM', restaurant: R[2], tags: [{ id: 6, name: 'Healthy' }] }],
  3: [{ id: 3, name: 'Banana Bread', price: 5.00, quantity: 8, pickup_time: '3:00 PM', restaurant: R[3], tags: [{ id: 7, name: 'Vegetarian' }] }],
};

export default function KitchenProfile() {
  const { id } = useParams();
  const nav = useNavigate();
  const { isMobile } = useWindowSize();
  const r = R[id] || R[2];
  const products = P[id] || P[2];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: isMobile ? 10 : 32 }}>
      <div style={{ background: 'linear-gradient(135deg,#1f5c3f,#2d7a53)', borderRadius: 16, padding: isMobile ? 16 : '24px 28px', color: '#fff', marginBottom: 16 }}>
        <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: isMobile ? 20 : 26, fontWeight: 700, marginBottom: 4 }}>{r.name}</div>
        <div style={{ fontSize: 13, opacity: .85, marginBottom: 6 }}>{r.cuisine} Cuisine</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>⭐ {r.rating} / 5</div>
      </div>
      <div style={{ background: '#fffdf8', border: '1px solid #ddd2bf', borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>About</div>
        <p style={{ color: '#555', fontSize: 13 }}>{r.desc}</p>
      </div>
      <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, fontWeight: 700, color: '#1f5c3f', marginBottom: 10 }}>Available Now</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{products.map(p => <FoodCard key={p.id} product={p} onClick={() => nav(`/offer/${p.id}`)} />)}</div>
    </div>
  );
}
