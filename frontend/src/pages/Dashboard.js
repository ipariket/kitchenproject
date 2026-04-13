/**
 * Dashboard.js — Kitchen owner's order management dashboard.
 *
 * This page has a DIFFERENT design from the customer-facing pages:
 *   - Dark theme (from your main.css: --bg: #000, --surface: #0f1420)
 *   - Stat cards showing order counts by status
 *   - Customer list + Recent orders table
 *
 * Only visible to logged-in users (App.js redirects if not authenticated).
 * Restaurant owners see order management; customers see their orders.
 *
 * Key React concepts:
 *   useEffect: fetch dashboard data on mount
 *   Conditional rendering: show different UI based on accountType
 */

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';

// Dark theme colors (from your main.css)
const dark = {
  bg: '#000000',
  surface: '#0f1420',
  surface2: '#212438',
  border: 'rgba(255,255,255,0.06)',
  text: '#e2e8f0',
  muted: '#64748b',
  accent: '#38bdf8',
  green: '#4ade80',
  amber: '#fbbf24',
  red: '#f87171',
  purple: '#a78bfa',
};

const styles = {
  page: {
    background: dark.bg,
    minHeight: 'calc(100vh - 64px)',
    padding: '24px 32px',
    fontFamily: "'DM Sans', sans-serif",
    color: dark.text,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 26,
    fontWeight: 700,
    color: dark.text,
  },
  createBtn: {
    padding: '10px 20px',
    borderRadius: 10,
    border: 'none',
    background: dark.accent,
    color: '#000',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'opacity 0.15s',
    textDecoration: 'none',
  },
  // Stat cards row (from main.css .stat-row)
  statRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    background: dark.surface,
    border: `1px solid ${dark.border}`,
    borderRadius: 14,
    padding: '20px 22px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s, border-color 0.2s',
    cursor: 'default',
  },
  statBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 12,
  },
  statNum: {
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: dark.muted,
    fontWeight: 600,
  },
  // Panels (tables)
  grid: {
    display: 'grid',
    gridTemplateColumns: '5fr 7fr',
    gap: 20,
  },
  panel: {
    background: dark.surface,
    border: `1px solid ${dark.border}`,
    borderRadius: 14,
    overflow: 'hidden',
  },
  panelHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: `1px solid ${dark.border}`,
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: dark.text,
  },
  addBtn: {
    background: dark.surface2,
    color: dark.muted,
    border: `1px solid ${dark.border}`,
    borderRadius: 8,
    padding: '4px 12px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '10px 20px',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: dark.muted,
    fontWeight: 600,
    borderBottom: `1px solid ${dark.border}`,
    textAlign: 'left',
  },
  td: {
    padding: '12px 20px',
    fontSize: 14,
    color: dark.text,
    borderBottom: `1px solid ${dark.border}`,
  },
  tdMuted: {
    color: dark.muted,
    fontSize: 12,
  },
  // Status badges
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    display: 'inline-block',
  },
  // Avatar circle
  avatar: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 8,
    background: dark.surface2,
    color: dark.accent,
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginRight: 8,
  },
  actionBtn: {
    padding: '4px 10px',
    borderRadius: 7,
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    marginRight: 4,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.15s',
  },
};

function Dashboard() {
  const { user, accountType } = useContext(AuthContext);
  const [stats, setStats] = useState({ pending: 0, ready_for_pickup: 0, completed: 0, total: 0 });
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // TODO: Replace with real API calls:
      // const [statsRes, ordersRes] = await Promise.all([getDashboardStats(), getOrders()]);
      // setStats(statsRes.data);
      // setOrders(ordersRes.data.results || ordersRes.data);

      // Mock data matching your dashboard.html
      setStats({ pending: 5, ready_for_pickup: 3, completed: 12, total: 20 });
      setOrders([
        { id: 1, customer: 'John Doe', product: 'Chicken Tikka', status: 'Pending', date: '2024-03-15' },
        { id: 2, customer: 'Jane Smith', product: 'Veggie Pasta', status: 'Ready for Pickup', date: '2024-03-15' },
        { id: 3, customer: 'Mike Johnson', product: 'Banana Bread', status: 'Completed', date: '2024-03-14' },
        { id: 4, customer: 'Sarah Wilson', product: 'Fresh Salad Bowl', status: 'Pending', date: '2024-03-14' },
        { id: 5, customer: 'Tom Brown', product: 'Tacos Al Pastor', status: 'Completed', date: '2024-03-13' },
      ]);
      setCustomers([
        { name: 'John Doe', phone: '555-0101', date: 'Mar 10, 2024' },
        { name: 'Jane Smith', phone: '555-0102', date: 'Mar 08, 2024' },
        { name: 'Mike Johnson', phone: '555-0103', date: 'Mar 05, 2024' },
        { name: 'Sarah Wilson', phone: '555-0104', date: 'Feb 28, 2024' },
      ]);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  };

  // Badge color based on status
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { background: 'rgba(251,191,36,0.12)', color: dark.amber };
      case 'Ready for Pickup':
        return { background: 'rgba(56,189,248,0.12)', color: dark.accent };
      case 'Completed':
        return { background: 'rgba(74,222,128,0.12)', color: dark.green };
      default:
        return { background: 'rgba(100,116,139,0.15)', color: dark.muted };
    }
  };

  // Stat card definitions with colors
  const statCards = [
    { label: 'Pending', value: stats.pending, icon: '⏳', color: dark.amber },
    { label: 'Ready for Pickup', value: stats.ready_for_pickup, icon: '🔔', color: dark.accent },
    { label: 'Completed', value: stats.completed, icon: '✓', color: dark.green },
    { label: 'Total Orders', value: stats.total, icon: '#', color: dark.purple },
  ];

  return (
    <div style={styles.page}>
      {/* Page header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          {accountType === 'restaurant' ? '👨‍🍳 Kitchen Dashboard' : '🍽️ My Orders'}
        </h1>
        {accountType === 'restaurant' && (
          <Link to="/create-offer" style={styles.createBtn}>
            + Create Offer
          </Link>
        )}
      </div>

      {/* Stat cards (from main.css .stat-row) */}
      <div style={styles.statRow}>
        {statCards.map((stat, i) => (
          <div
            key={i}
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = dark.border;
            }}
          >
            <div style={styles.statIcon}>{stat.icon}</div>
            <div style={{ ...styles.statNum, color: stat.color }}>
              {stat.value}
            </div>
            <div style={styles.statLabel}>{stat.label}</div>
            <div style={{ ...styles.statBar, background: stat.color }} />
          </div>
        ))}
      </div>

      {/* Two-column layout: Customers + Orders */}
      <div style={styles.grid}>
        {/* Customers panel */}
        <div style={styles.panel}>
          <div style={styles.panelHead}>
            <span style={styles.panelTitle}>Customers</span>
            <span style={styles.addBtn}>+ Add</span>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i}>
                  <td style={styles.td}>
                    <span style={styles.avatar}>{c.name[0]}</span>
                    {c.name}
                  </td>
                  <td style={{ ...styles.td, ...styles.tdMuted }}>{c.phone}</td>
                  <td style={{ ...styles.td, ...styles.tdMuted }}>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Orders panel */}
        <div style={styles.panel}>
          <div style={styles.panelHead}>
            <span style={styles.panelTitle}>Recent Orders</span>
            <span style={styles.addBtn}>+ New</span>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={styles.td}>{order.customer}</td>
                  <td style={styles.td}>{order.product}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...getBadgeStyle(order.status) }}>
                      <span style={{ ...styles.badgeDot, background: 'currentColor' }} />
                      {order.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={{
                        ...styles.actionBtn,
                        background: 'rgba(56,189,248,0.1)',
                        color: dark.accent,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        ...styles.actionBtn,
                        background: 'rgba(248,113,113,0.1)',
                        color: dark.red,
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
