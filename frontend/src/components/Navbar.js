import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import useWindowSize from './useWindowSize';

export default function Navbar() {
  const { user, accountType, handleLogout } = useContext(AuthContext);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const { isMobile } = useWindowSize();

  const go = (to) => { nav(to); setOpen(false); };
  const search = (e) => { e.preventDefault(); if (q.trim()) { nav(`/?search=${encodeURIComponent(q)}`); setOpen(false); } };
  const doLogout = () => { handleLogout(); setOpen(false); nav('/'); window.location.reload(); };

  const lk = (highlight) => ({
    display: 'block', padding: isMobile ? '10px 14px' : '7px 14px',
    borderRadius: 10, fontSize: isMobile ? 15 : 14, fontWeight: 600,
    color: highlight ? '#fff' : '#333', background: highlight ? '#1f5c3f' : 'transparent',
    border: isMobile ? '1px solid #ddd2bf' : 'none', textAlign: 'center',
    marginBottom: isMobile ? 6 : 0, cursor: 'pointer', textDecoration: 'none',
  });

  const links = user ? [
    { label: 'Home', to: '/' },
    ...(accountType === 'restaurant' ? [{ label: 'Post Food', to: '/create-offer' }] : []),
    { label: 'Dashboard', to: '/dashboard', hl: true },
  ] : [
    { label: 'Home', to: '/' },
    { label: 'Login', to: '/login' },
    { label: 'Sign Up', to: '/signup', hl: true },
  ];

  return (
    <header style={{ background: '#f5efe3', borderBottom: '1px solid #d8cfbf', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', maxWidth: 900, margin: '0 auto' }}>
        <Link to="/" style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: isMobile ? 20 : 24, color: '#1f5c3f', whiteSpace: 'nowrap', textDecoration: 'none' }}>
          Kitchen<span style={{ color: '#5A9F68' }}>Share</span>
        </Link>

        {!isMobile && (
          <form onSubmit={search} style={{ flex: 1, maxWidth: 340, margin: '0 20px', position: 'relative' }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search food, cuisine..."
              style={{ width: '100%', padding: '9px 14px 9px 36px', border: '1px solid #c8bea9', borderRadius: 10, background: '#fffdf8', fontSize: 14, outline: 'none', fontFamily: "'DM Sans',sans-serif" }} />
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
          </form>
        )}

        {!isMobile ? (
          <nav style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {links.map((l, i) => <Link key={i} to={l.to} style={lk(l.hl)}>{l.label}</Link>)}
            {user && <span onClick={doLogout} style={{ ...lk(false), color: '#ef4444', border: '1px solid #fca5a5', background: '#fef2f2' }}>Logout</span>}
          </nav>
        ) : (
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', fontSize: 26, cursor: 'pointer', color: '#333' }}>{open ? '✕' : '☰'}</button>
        )}
      </div>

      {isMobile && open && (
        <div style={{ padding: '6px 16px 16px', borderTop: '1px solid #d8cfbf' }}>
          <form onSubmit={search} style={{ marginBottom: 10 }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search food..."
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #c8bea9', borderRadius: 10, background: '#fffdf8', fontSize: 14, outline: 'none' }} />
          </form>
          {links.map((l, i) => <div key={i} onClick={() => go(l.to)} style={lk(l.hl)}>{l.label}</div>)}
          {user && <div onClick={doLogout} style={{ ...lk(false), color: '#ef4444', border: '1px solid #fca5a5', background: '#fef2f2' }}>Logout</div>}
        </div>
      )}
    </header>
  );
}
