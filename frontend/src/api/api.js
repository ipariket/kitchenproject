/**
 * api.js — Centralized API client using Axios.
 *
 * All API calls go through this single Axios instance so we can:
 *   1. Set a base URL once (no repeating "http://localhost:8000/api" everywhere)
 *   2. Automatically attach the auth token to every request
 *   3. Handle errors in one place
 *
 * Axios interceptors run before every request/response:
 *   - Request interceptor: adds the Authorization header
 *   - Response interceptor: could handle 401 (expired token) globally
 */

import axios from 'axios';

// Create an Axios instance with default settings
// All requests will be prefixed with this baseURL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  // ↑ In production, set REACT_APP_API_URL environment variable
  // ↑ In development, defaults to Django's local server
});

// ---------------------------------------------------------------------------
// Request interceptor: runs before every API call
// ---------------------------------------------------------------------------
API.interceptors.request.use((config) => {
  // Retrieve the auth token from localStorage (set during login/register)
  const token = localStorage.getItem('token');
  if (token) {
    // DRF expects: Authorization: Token abc123...
    config.headers.Authorization = `Token ${token}`;
  }
  return config;  // Must return config or the request won't proceed
});

// ===========================================================================
// Auth API calls
// ===========================================================================

// POST /api/auth/login/ — returns { token, user, account_type }
export const loginUser = (credentials) =>
  API.post('/auth/login/', credentials);

// POST /api/auth/register/ — returns { token, user, account_type }
export const registerUser = (data) =>
  API.post('/auth/register/', data);

// GET /api/auth/profile/ — returns logged-in user's profile
export const getProfile = () =>
  API.get('/auth/profile/');

// ===========================================================================
// Product (food item) API calls
// ===========================================================================

// GET /api/products/?tags=1,2&cuisine=Indian&min_price=5
// params is an object like { tags: "1,2", cuisine: "Indian" }
export const getProducts = (params) =>
  API.get('/products/', { params });

// GET /api/products/1/ — single product details
export const getProduct = (id) =>
  API.get(`/products/${id}/`);

// POST /api/products/ — create a new food listing (restaurant owners)
// Uses FormData because we're uploading an image file
export const createProduct = (formData) =>
  API.post('/products/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    // ↑ Tells the server to expect a file upload, not JSON
  });

// ===========================================================================
// Restaurant API calls
// ===========================================================================

// GET /api/restaurants/?search=Italian
export const getRestaurants = (params) =>
  API.get('/restaurants/', { params });

// GET /api/restaurants/1/ — single restaurant details
export const getRestaurant = (id) =>
  API.get(`/restaurants/${id}/`);

// GET /api/restaurants/1/products/ — all products for a restaurant
export const getRestaurantProducts = (id) =>
  API.get(`/restaurants/${id}/products/`);

// ===========================================================================
// Tag API calls
// ===========================================================================

// GET /api/tags/ — all available tags for the filter UI
export const getTags = () =>
  API.get('/tags/');

// ===========================================================================
// Order API calls
// ===========================================================================

// GET /api/orders/ — list orders (filtered by user type in backend)
export const getOrders = () =>
  API.get('/orders/');

// POST /api/orders/ — place a new order
export const createOrder = (data) =>
  API.post('/orders/', data);

// PATCH /api/orders/1/update_status/ — restaurant updates order status
export const updateOrderStatus = (id, statusData) =>
  API.patch(`/orders/${id}/update_status/`, statusData);

// ===========================================================================
// Dashboard API calls
// ===========================================================================

// GET /api/dashboard/stats/ — order count stats for restaurant dashboard
export const getDashboardStats = () =>
  API.get('/dashboard/stats/');

export default API;
