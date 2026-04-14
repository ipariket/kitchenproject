/**
 * Home.js — Main page where customers browse food offers.
 *
 * Layout (from index7.html):
 *   Left sidebar:  Menu navigation + Featured section
 *   Center:        Food carousel + filter bar + food listing cards
 *   Right sidebar:  Login box (if not logged in) + Map placeholder
 *
 * Data flow:
 *   1. On mount, fetch products and tags from the API
 *   2. User can filter by tags, cuisine, price via FilterBar
 *   3. Filtered results update the product list
 *   4. Clicking a card navigates to offer detail page
 *
 * Key React concepts:
 *   useEffect: fetch data on mount and when filters change
 *   useState: manage products, tags, selected filters, loading state
 *   useNavigate: programmatic navigation to detail pages
 *   useSearchParams: read ?search= query from URL (from Navbar search)
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import FoodCarousel from '../components/FoodCarousel';
import FilterBar from '../components/FilterBar';
import FoodCard from '../components/FoodCard';
import Sidebar from '../components/Sidebar';

const styles = {
  layout: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr 220px',
    gap: 16,
    padding: 16,
    minHeight: 'calc(100vh - 64px)',
  },
  center: {
    minWidth: 0,  // Prevents overflow in grid
  },
  centerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heading: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 22,
    fontWeight: 700,
    color: '#1f5c3f',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  rightSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  box: {
    background: '#fffdf8',
    border: '1px solid #ddd2bf',
    borderRadius: 14,
    padding: 14,
  },
  boxTitle: {
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 10,
  },
  btn: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #c8bea9',
    background: '#fffdf8',
    cursor: 'pointer',
    marginTop: 8,
    fontWeight: 600,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.15s',
    textAlign: 'center',
    display: 'block',
    color: '#111',
  },
  btnDark: {
    background: '#1f5c3f',
    color: '#fff',
    borderColor: '#1f5c3f',
  },
  placeholder: {
    height: 160,
    border: '1px dashed #b7ab95',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#555',
    background: '#faf6ee',
    fontSize: 13,
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#555',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
};

function Home() {
  const { user, accountType } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ── State ──
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 100]);
  const [loading, setLoading] = useState(true);

  // Read search query from URL (set by Navbar search form)
  const searchQuery = searchParams.get('search') || '';

  // ── Fetch data on mount and when filters change ──
  useEffect(() => {
    loadData();
  }, [searchQuery, selectedTags, priceRange]);

  /**
   * Loads products and tags from the API.
   * In production, this calls the real Django API.
   * For now, we use mock data so the app works without the backend.
   */
  const loadData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API calls when backend is running:
      // const [prodRes, tagRes] = await Promise.all([
      //   getProducts({ search: searchQuery, tags: selectedTags.join(','), max_price: priceRange[1] }),
      //   getTags()
      // ]);
      // setProducts(prodRes.data.results || prodRes.data);
      // setTags(tagRes.data);

      // ── Mock data (matches your original HTML files) ──
      const mockTags = [
        { id: 1, name: 'Mexican' }, { id: 2, name: 'Chinese' },
        { id: 3, name: 'Italian' }, { id: 4, name: 'Indian' },
        { id: 5, name: 'Thai' },    { id: 6, name: 'Healthy' },
        { id: 7, name: 'Vegetarian' }, { id: 8, name: 'Halal' },
        { id: 9, name: 'Vegan' },   { id: 10, name: 'Gluten-Free' },
      ];

      const mockProducts = [
        {
          id: 1, name: 'Chicken Tikka', price: 12.99, quantity: 3,
          pickup_time: '6:00 PM', dietary_info: 'Halal',
          restaurant: { id: 1, name: 'Spice Corner', cuisine: 'Indian' },
          tags: [{ id: 4, name: 'Indian' }, { id: 8, name: 'Halal' }],
          is_available: true, image: null, emoji: '🍗',
        },
        {
          id: 2, name: 'Veggie Pasta', price: 9.50, quantity: 5,
          pickup_time: '5:30 PM', dietary_info: 'Vegetarian',
          restaurant: { id: 2, name: 'Sunny Spoon Kitchen', cuisine: 'Italian' },
          tags: [{ id: 3, name: 'Italian' }, { id: 7, name: 'Vegetarian' }],
          is_available: true, image: null, emoji: '🍝',
        },
        {
          id: 3, name: 'Banana Bread', price: 5.00, quantity: 8,
          pickup_time: '3:00 PM', dietary_info: 'Vegetarian',
          restaurant: { id: 3, name: 'Grandma Bakes', cuisine: 'Bakery' },
          tags: [{ id: 7, name: 'Vegetarian' }],
          is_available: true, image: null, emoji: '🍞',
        },
        {
          id: 4, name: 'Fresh Salad Bowl', price: 8.75, quantity: 4,
          pickup_time: '6:00 PM', dietary_info: 'Vegan',
          restaurant: { id: 2, name: 'Sunny Spoon Kitchen', cuisine: 'Italian' },
          tags: [{ id: 6, name: 'Healthy' }, { id: 9, name: 'Vegan' }],
          is_available: true, image: null, emoji: '🥗',
        },
        {
          id: 5, name: 'Tacos Al Pastor', price: 11.00, quantity: 6,
          pickup_time: '7:00 PM', dietary_info: 'Contains Gluten',
          restaurant: { id: 4, name: 'Casa de Sabor', cuisine: 'Mexican' },
          tags: [{ id: 1, name: 'Mexican' }],
          is_available: true, image: null, emoji: '🌮',
        },
        {
          id: 6, name: 'Pad Thai', price: 10.50, quantity: 3,
          pickup_time: '6:30 PM', dietary_info: 'Contains Peanuts',
          restaurant: { id: 5, name: 'Bangkok Bites', cuisine: 'Thai' },
          tags: [{ id: 5, name: 'Thai' }],
          is_available: true, image: null, emoji: '🍜',
        },
        {
          id: 7, name: 'Kung Pao Chicken', price: 13.25, quantity: 2,
          pickup_time: '6:00 PM', dietary_info: 'Contains Peanuts',
          restaurant: { id: 6, name: 'Golden Wok', cuisine: 'Chinese' },
          tags: [{ id: 2, name: 'Chinese' }],
          is_available: true, image: null, emoji: '🥡',
        },
        {
          id: 8, name: 'Margherita Pizza', price: 14.00, quantity: 4,
          pickup_time: '5:00 PM', dietary_info: 'Vegetarian',
          restaurant: { id: 7, name: 'Napoli Fire', cuisine: 'Italian' },
          tags: [{ id: 3, name: 'Italian' }, { id: 7, name: 'Vegetarian' }],
          is_available: true, image: null, emoji: '🍕',
        },
      ];

      setTags(mockTags);

      // Apply filters to mock data
      let filtered = [...mockProducts];

      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.restaurant?.name.toLowerCase().includes(q) ||
          p.restaurant?.cuisine.toLowerCase().includes(q) ||
          p.dietary_info?.toLowerCase().includes(q)
        );
      }

      // Tag filter (by tag name for quick chips, by ID for dropdown)
      if (selectedTags.length > 0) {
        filtered = filtered.filter(p =>
          p.tags.some(t =>
            selectedTags.includes(t.id) || selectedTags.includes(t.name)
          ) ||
          selectedTags.includes(p.restaurant?.cuisine)
        );
      }

      // Price filter
      filtered = filtered.filter(p =>
        p.price >= priceRange[0] && p.price <= priceRange[1]
      );

      setProducts(filtered);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle a tag in the selected tags array.
   * If already selected, remove it. If not, add it.
   */
  const handleTagToggle = (tagIdOrName) => {
    setSelectedTags(prev =>
      prev.includes(tagIdOrName)
        ? prev.filter(t => t !== tagIdOrName)   // Remove
        : [...prev, tagIdOrName]                 // Add
    );
  };

  const handleCardClick = (product) => {
    navigate(`/offer/${product.id}`);
  };

  // Sidebar menu items
  const sidebarItems = [
    { label: 'Home', href: '/', icon: '🏠', active: true },
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Create Offer', href: '/create-offer', icon: '➕' },
  ];

  return (
    <main style={styles.layout}>
      {/* ── Left Sidebar ── */}
      <Sidebar items={sidebarItems}>
        <div style={styles.box}>
          <div style={styles.boxTitle}>🔥 Featured</div>
          <div style={styles.placeholder}>
            Featured kitchens coming soon
          </div>
        </div>
      </Sidebar>

      {/* ── Center Content ── */}
      <section style={styles.center}>
        {/* Food carousel */}
        <FoodCarousel
          items={products}
          onItemClick={handleCardClick}
        />

        {/* Header + filter bar */}
        <div style={styles.centerHeader}>
          <h2 style={styles.heading}>
            {searchQuery ? `Results for "${searchQuery}"` : 'Nearby Kitchens'}
          </h2>
        </div>

        <FilterBar
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          onApply={loadData}
        />

        {/* Product listing */}
        {loading ? (
          // Loading skeleton cards
          <div style={styles.list}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 90, borderRadius: 14 }} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="list stagger" style={styles.list}>
            {products.map((product) => (
              <FoodCard
                key={product.id}
                product={product}
                onClick={handleCardClick}
              />
            ))}
          </div>
        ) : (
          // Empty state
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🍽️</div>
            <h3>No food found</h3>
            <p>Try adjusting your filters or search for something else.</p>
          </div>
        )}
      </section>

      {/* ── Right Sidebar ── */}
      <aside style={styles.rightSidebar}>
        {!user ? (
          // Login/signup box (from index7.html)
          <div style={styles.box}>
            <div style={styles.boxTitle}>Login / Sign Up</div>
            <Link to="/login">
              <button style={{ ...styles.btn, ...styles.btnDark }}>Login</button>
            </Link>
            <Link to="/signup">
              <button style={styles.btn}>Sign Up</button>
            </Link>
          </div>
        ) : (
          <div style={styles.box}>
            <div style={styles.boxTitle}>👋 Welcome back!</div>
            <p style={{ fontSize: 13, color: '#555' }}>
              {user.username}
              <br />
              <small>{accountType === 'restaurant' ? 'Restaurant Owner' : 'Customer'}</small>
            </p>
            <Link to="/dashboard">
              <button style={{ ...styles.btn, ...styles.btnDark }}>Go to Dashboard</button>
            </Link>
          </div>
        )}

        <div style={styles.box}>
          <div style={styles.boxTitle}>📍 Map</div>
          <div style={styles.placeholder}>
            Map integration coming soon
          </div>
        </div>

        <div style={styles.box}>
          <div style={styles.boxTitle}>ℹ️ About KitchenShare</div>
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>
            Discover homemade food from local kitchens near you. 
            Browse, order, and pick up fresh meals today!
          </p>
        </div>
      </aside>
    </main>
  );
}

export default Home;
