/**
 * App.js — Root component and router.
 *
 * This is the top-level component that:
 *   1. Provides authentication state to all child components via React Context
 *   2. Sets up client-side routing with react-router-dom
 *   3. Renders the Navbar on every page
 *   4. Maps URL paths to page components
 *
 * React Context is used instead of prop drilling — any component anywhere
 * in the tree can access auth state with useContext(AuthContext).
 *
 * BrowserRouter enables client-side routing (no page reloads when navigating).
 * Routes/Route maps URL paths to components.
 */

import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateOffer from './pages/CreateOffer';
import OfferDetail from './pages/OfferDetail';
import KitchenProfile from './pages/KitchenProfile';
import { getProfile } from './api/api';

// Create a Context object for auth state.
// Any component can consume this with: const { user } = useContext(AuthContext)
export const AuthContext = createContext(null);

function App() {
  // ── Auth state ──
  // user: the logged-in user object (or null if not logged in)
  // accountType: "customer" or "restaurant"
  // loading: true while we're checking if there's a saved token
  const [user, setUser] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Check for existing token on app load ──
  // This runs once when the app first mounts.
  // If the user previously logged in (token in localStorage), we validate it.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Call the profile endpoint to validate the token and get user data
      getProfile()
        .then((res) => {
          setUser(res.data.user);             // Set user object
          setAccountType(res.data.account_type); // "customer" or "restaurant"
        })
        .catch(() => {
          // Token is invalid or expired — clear it
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));    // Stop loading spinner
    } else {
      setLoading(false);  // No token — not logged in
    }
  }, []);  // Empty dependency array = run only once on mount

  /**
   * Login handler — called by Login/Signup pages after successful API call.
   * Saves the token and updates auth state.
   */
  const handleLogin = (token, userData, type) => {
    localStorage.setItem('token', token);    // Persist token across page reloads
    setUser(userData);
    setAccountType(type);
  };

  /**
   * Logout handler — clears everything.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');        // Remove persisted token
    setUser(null);
    setAccountType(null);
  };

  // Show nothing while checking token validity
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#f5efe3'
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1f5c3f' }}>
          KitchenShare
        </div>
      </div>
    );
  }

  return (
    // AuthContext.Provider makes auth state available to ALL child components
    // Any component can do: const { user, handleLogout } = useContext(AuthContext)
    <AuthContext.Provider value={{ user, accountType, handleLogin, handleLogout }}>
      {/* BrowserRouter enables client-side routing */}
      <BrowserRouter>
        {/* Navbar appears on every page */}
        <Navbar />

        {/* Routes maps URL paths to page components */}
        <Routes>
          {/* Public routes — anyone can access */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            // If already logged in, redirect to dashboard or home
            user ? <Navigate to={accountType === 'restaurant' ? '/dashboard' : '/'} />
                 : <Login />
          } />
          <Route path="/signup" element={
            user ? <Navigate to={accountType === 'restaurant' ? '/dashboard' : '/'} />
                 : <Signup />
          } />

          {/* Offer detail — anyone can view */}
          <Route path="/offer/:id" element={<OfferDetail />} />

          {/* Kitchen profile — anyone can view */}
          <Route path="/kitchen/:id" element={<KitchenProfile />} />

          {/* Protected routes — must be logged in */}
          <Route path="/dashboard" element={
            user ? <Dashboard /> : <Navigate to="/login" />
          } />
          <Route path="/create-offer" element={
            user ? <CreateOffer /> : <Navigate to="/login" />
          } />

          {/* Catch-all: redirect unknown URLs to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
