/**
 * Sidebar.js — Collapsible sidebar menu.
 *
 * Ported from newKitchen.html:
 *   - Toggle button (☰) collapses/expands the sidebar
 *   - Menu links hide when collapsed, only icons remain
 *   - Smooth width transition (0.3s)
 *
 * Props:
 *   items: array of { label, href, icon, active } menu items
 *   children: any extra content (like the rating box)
 *
 * Key React concept:
 *   useState: tracks whether the sidebar is collapsed (boolean toggle)
 */

import React, { useState } from 'react';

const styles = {
  sidebar: {
    width: 220,
    background: '#fffdf8',
    borderRight: '1px solid #ddd2bf',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    // Smooth collapse animation (from newKitchen.html .sidebar transition)
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    flexShrink: 0,           // Don't shrink when flex container is tight
  },
  sidebarCollapsed: {
    width: 60,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 700,
    fontSize: 15,
    // Title hides when collapsed
    transition: 'opacity 0.2s',
  },
  toggle: {
    cursor: 'pointer',
    fontSize: 20,
    background: 'none',
    border: 'none',
    padding: '4px 8px',
    borderRadius: 8,
    transition: 'background 0.15s',
    color: '#333',
  },
  menu: {
    background: '#fffdf8',
    border: '1px solid #ddd2bf',
    borderRadius: 14,
    padding: 12,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    color: '#111',
    padding: '10px 10px',
    borderRadius: 10,
    border: '1px solid #eee2cf',
    marginBottom: 8,
    background: '#fffdf8',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.15s',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  linkActive: {
    borderColor: '#1f5c3f',
    fontWeight: 700,
    background: '#efe7d6',
  },
  linkIcon: {
    fontSize: 16,
    flexShrink: 0,           // Icon stays visible when text is hidden
    width: 20,
    textAlign: 'center',
  },
  linkLabel: {
    transition: 'opacity 0.2s',
  },
};

function Sidebar({ items = [], children }) {
  // Track collapsed state — false = expanded, true = collapsed
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      ...styles.sidebar,
      // Merge collapsed styles when collapsed is true
      ...(collapsed ? styles.sidebarCollapsed : {}),
    }}>
      {/* Header with title and toggle button */}
      <div style={styles.header}>
        <span style={{
          ...styles.title,
          opacity: collapsed ? 0 : 1,  // Fade out title when collapsed
        }}>
          Menu
        </span>
        <button
          style={styles.toggle}
          onClick={() => setCollapsed(!collapsed)}  // Toggle the boolean
          // Hover effect
          onMouseEnter={(e) => e.target.style.background = '#efe7d6'}
          onMouseLeave={(e) => e.target.style.background = 'none'}
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          ☰
        </button>
      </div>

      {/* Menu links */}
      <div style={styles.menu}>
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            style={{
              ...styles.link,
              // Apply active styles if this item is marked active
              ...(item.active ? styles.linkActive : {}),
            }}
            onMouseEnter={(e) => {
              if (!item.active) e.currentTarget.style.background = '#faf6ee';
            }}
            onMouseLeave={(e) => {
              if (!item.active) e.currentTarget.style.background = '#fffdf8';
            }}
          >
            {/* Icon always visible */}
            <span style={styles.linkIcon}>{item.icon}</span>
            {/* Label hides when collapsed */}
            <span style={{
              ...styles.linkLabel,
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
            }}>
              {item.label}
            </span>
          </a>
        ))}
      </div>

      {/* Extra content (passed as children) — hidden when collapsed */}
      {!collapsed && children}
    </aside>
  );
}

export default Sidebar;
