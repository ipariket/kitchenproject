/**
 * Login.js — Login page.
 *
 * Matches the beige/green palette from your styles.css.
 * Centered form layout with brand header.
 *
 * Flow:
 *   1. User enters username + password
 *   2. On submit, calls loginUser() API
 *   3. On success, calls handleLogin() from AuthContext (stores token)
 *   4. App.js automatically redirects to dashboard
 *
 * Key React concepts:
 *   useState: tracks form field values and error messages
 *   useContext: accesses handleLogin from AuthContext
 *   Controlled inputs: input values are driven by React state
 *   e.preventDefault(): stops form from reloading the page
 */

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { loginUser } from '../api/api';

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
    maxWidth: 400,
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
    transition: 'background 0.2s, transform 0.15s',
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
    textDecoration: 'none',
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

function Login() {
  // Get handleLogin from AuthContext (sets token + user state globally)
  const { handleLogin } = useContext(AuthContext);

  // Form state — each input is "controlled" (value comes from state)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle form submission.
   * Calls the login API, then updates global auth state on success.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();         // Prevent page reload
    setError('');               // Clear previous errors
    setLoading(true);

    try {
      // Call POST /api/auth/login/ with credentials
      const res = await loginUser({ username, password });
      // On success, store token and user data in global state
      handleLogin(res.data.token, res.data.user, res.data.account_type);
      // App.js will auto-redirect because user is now set
    } catch (err) {
      // Show error from API or a generic message
      setError(
        err.response?.data?.error || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          Kitchen<span style={{ color: '#5A9F68' }}>Share</span>
        </div>
        <p style={styles.subtitle}>Welcome back! Sign in to your account.</p>

        {/* Error message (shown when login fails) */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Login form — onSubmit calls handleSubmit */}
        <div>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = '#1f5c3f';
              e.target.style.boxShadow = '0 0 0 3px rgba(31,92,63,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#c8bea9';
              e.target.style.boxShadow = 'none';
            }}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = '#1f5c3f';
              e.target.style.boxShadow = '0 0 0 3px rgba(31,92,63,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#c8bea9';
              e.target.style.boxShadow = 'none';
            }}
          />

          <button
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
            }}
            onClick={handleSubmit}
            disabled={loading}
            onMouseEnter={(e) => e.target.style.background = '#2d7a53'}
            onMouseLeave={(e) => e.target.style.background = '#1f5c3f'}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </div>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
