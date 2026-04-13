/**
 * Signup.js — Registration page.
 *
 * Layout from your signup.html but styled in React.
 * Has Customer/Restaurant account type selector.
 *
 * Flow:
 *   1. User fills in name, email, password, account type
 *   2. On submit, calls registerUser() API
 *   3. On success, calls handleLogin() (auto-login after registration)
 *   4. App.js redirects to dashboard
 */

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { registerUser } from '../api/api';

const styles = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 64px)',
    padding: 20,
  },
  card: {
    background: '#fffdf8',
    border: '1px solid #ddd2bf',
    borderRadius: 18,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    animation: 'fadeIn 0.4s ease-out',
  },
  logo: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 28,
    fontWeight: 700,
    color: '#1f5c3f',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
    marginBottom: 28,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #c8bea9',
    borderRadius: 10,
    background: '#fffdf8',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 16,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  // Account type selector (two big buttons side by side)
  typeSelector: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginBottom: 16,
  },
  typeBtn: {
    padding: '14px 12px',
    borderRadius: 12,
    border: '2px solid #ddd2bf',
    background: '#fffdf8',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  typeBtnActive: {
    borderColor: '#1f5c3f',
    background: '#e8f5e9',
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
  },
  btn: {
    width: '100%',
    padding: '12px',
    borderRadius: 10,
    border: 'none',
    background: '#1f5c3f',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.2s',
    marginTop: 4,
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#555',
  },
  link: {
    color: '#1f5c3f',
    fontWeight: 600,
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
};

function Signup() {
  const { handleLogin } = useContext(AuthContext);

  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('customer');
  const [restaurantName, setRestaurantName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await registerUser({
        username,
        email,
        password,
        account_type: accountType,
        restaurant_name: restaurantName || username,
      });
      handleLogin(res.data.token, res.data.user, res.data.account_type);
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        // Format Django validation errors into a readable string
        const msg = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        setError(msg);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Shared focus handler for inputs
  const focusStyle = (e) => {
    e.target.style.borderColor = '#1f5c3f';
    e.target.style.boxShadow = '0 0 0 3px rgba(31,92,63,0.1)';
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = '#c8bea9';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          Kitchen<span style={{ color: '#5A9F68' }}>Share</span>
        </div>
        <p style={styles.subtitle}>Create your account to get started.</p>

        {error && <div style={styles.error}>{error}</div>}

        <div>
          {/* Account type selector */}
          <label style={styles.label}>Account Type</label>
          <div style={styles.typeSelector}>
            <div
              style={{
                ...styles.typeBtn,
                ...(accountType === 'customer' ? styles.typeBtnActive : {}),
              }}
              onClick={() => setAccountType('customer')}
            >
              <div style={styles.typeIcon}>🍽️</div>
              <div style={styles.typeLabel}>Customer</div>
            </div>
            <div
              style={{
                ...styles.typeBtn,
                ...(accountType === 'restaurant' ? styles.typeBtnActive : {}),
              }}
              onClick={() => setAccountType('restaurant')}
            >
              <div style={styles.typeIcon}>👨‍🍳</div>
              <div style={styles.typeLabel}>Restaurant</div>
            </div>
          </div>

          <label style={styles.label}>Username</label>
          <input
            style={styles.input} type="text" placeholder="Choose a username"
            value={username} onChange={(e) => setUsername(e.target.value)}
            onFocus={focusStyle} onBlur={blurStyle}
          />

          <label style={styles.label}>Email</label>
          <input
            style={styles.input} type="email" placeholder="Enter your email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            onFocus={focusStyle} onBlur={blurStyle}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input} type="password" placeholder="Create a password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            onFocus={focusStyle} onBlur={blurStyle}
          />

          {/* Restaurant name — only shown for restaurant accounts */}
          {accountType === 'restaurant' && (
            <>
              <label style={styles.label}>Restaurant Name</label>
              <input
                style={styles.input} type="text" placeholder="Your kitchen/restaurant name"
                value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)}
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </>
          )}

          <button
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
            onMouseEnter={(e) => e.target.style.background = '#2d7a53'}
            onMouseLeave={(e) => e.target.style.background = '#1f5c3f'}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </div>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
