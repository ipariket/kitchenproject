/**
 * Navbar.js — Top navigation bar.
 *
 * Matches the topbar from your index7.html:
 *   - Brand name on the left
 *   - Search bar in the center
 *   - Navigation links on the right (changes based on login state)
 *
 * Uses AuthContext to check if user is logged in and show appropriate links.
 * useNavigate() programmatically navigates (e.g., after search submit).
 * Link renders an <a> tag that does client-side navigation (no page reload).
 */

import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

// ── Inline styles (keeps component self-contained) ──
const styles = {
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    borderBottom: '1px solid #d8cfbf',
    background: '#f5efe3',
    position: 'sticky',       // Stays at top when scrolling
    top: 0,
    zIndex: 100,              // Above other content
    gap: 16,
  },
  brand: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700,
    fontSize: 22,
    color: '#1f5c3f',
    letterSpacing: '-0.5px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',    // Prevent wrapping on small screens
  },
  brandAccent: {
    color: '#5A9F68',
    fontWeight: 600,
  },
  searchWrap: {
    flex: 1,
    maxWidth: 420,
    position: 'relative',
  },
  search: {
    width: '100%',
    padding: '10px 14px 10px 36px',  // Left padding for search icon
    border: '1px solid #c8bea9',
    borderRadius: 10,
    background: '#fffdf8',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
    fontSize: 14,
    pointerEvents: 'none',   // Click passes through to the input
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  navLink: {
    padding: '7px 12px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: '#333',
    transition: 'background 0.2s, color 0.2s',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    fontFamily: "'DM Sans', sans-serif",
  },
  navLinkActive: {
    background: '#1f5c3f',
    color: '#fff',
    fontWeight: 600,
  },
  logoutBtn: {
    padding: '7px 12px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: '#ef4444',
    cursor: 'pointer',
    border: '1px solid #fca5a5',
    background: '#fef2f2',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.2s',
  },
};

function Navbar() {
  // Get auth state from context (provided by App.js)
  const { user, accountType, handleLogout } = useContext(AuthContext);
  // State for the search input
  const [searchQuery, setSearchQuery] = useState('');
  // useNavigate lets us programmatically change the URL
  const navigate = useNavigate();

  /**
   * Handle search form submission.
   * Navigates to home page with search query as a URL parameter.
   * The Home page reads this parameter and filters products.
   */
  const handleSearch = (e) => {
    e.preventDefault();  // Prevent default form submission (page reload)
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header style={styles.topbar}>
      {/* Brand — clicking navigates to home */}
      <Link to="/" style={styles.brand}>
        Kitchen<span style={styles.brandAccent}>Share</span>
      </Link>

      {/* Search bar wrapped in a form for Enter key submission */}
      <form onSubmit={handleSearch} style={styles.searchWrap}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          style={styles.search}
          type="text"
          placeholder="Search food, cuisine, restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          // Focus styles applied via onFocus/onBlur
          onFocus={(e) => {
            e.target.style.borderColor = '#1f5c3f';
            e.target.style.boxShadow = '0 0 0 3px rgba(31,92,63,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#c8bea9';
            e.target.style.boxShadow = 'none';
          }}
        />
      </form>

      {/* Navigation links — change based on login state */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink}>Home</Link>

        {user ? (
          // ── Logged in: show Dashboard + logout ──
          <>
            {accountType === 'restaurant' && (
              // Only restaurant owners see "Create Offer"
              <Link to="/create-offer" style={styles.navLink}>Create Offer</Link>
            )}
            <Link
              to="/dashboard"
              style={{ ...styles.navLink, ...styles.navLinkActive }}
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                handleLogout();       // Clear auth state
                navigate('/');        // Redirect to home
              }}
              style={styles.logoutBtn}
            >
              Logout
            </button>
          </>
        ) : (
          // ── Not logged in: show Login + Sign Up ──
          <>
            <Link to="/login" style={styles.navLink}>Login</Link>
            <Link
              to="/signup"
              style={{ ...styles.navLink, ...styles.navLinkActive }}
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
