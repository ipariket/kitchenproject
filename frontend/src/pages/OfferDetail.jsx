import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { getProducts, createOrder } from '../api/api';
import useWindowSize from '../components/useWindowSize';

export default function OfferDetail() {
  const { id } = useParams();
  const { user, accountType } = useContext(AuthContext);
  const { isMobile } = useWindowSize();
  const nav = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [scheduledPickup, setScheduledPickup] = useState('');
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getProducts();
        const items = res.data.results || res.data || [];
        setProduct(items.find(p => p.id === parseInt(id)) || null);
      } catch { setProduct(null); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleClaim = async () => {
    setClaiming(true); setError('');
    try {
      await createOrder({ product_id: parseInt(id), quantity: qty, scheduled_pickup: scheduledPickup });
      setClaimed(true); setConfirm(false);
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to place order.');
      setConfirm(false);
    } finally { setClaiming(false); }
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#555' }}>Loading...</div>;
  if (!product) return <div style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center', padding: 20 }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div><h3>Offer not found</h3>
    <p style={{ color: '#555', marginBottom: 16 }}>May no longer be available.</p>
    <Link to="/" style={{ padding: '10px 24px', borderRadius: 10, background: '#1f5c3f', color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Browse Food</Link>
  </div>;

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: isMobile ? 10 : 32 }}>
      <div style={{ background: '#fffdf8', border: '1px solid #ddd2bf', borderRadius: 18, overflow: 'hidden' }}>
        {/* Image */}
        {(product.image || product.image_url) ? (
          <img src={product.image_url || product.image} alt={product.name} style={{ width: '100%', height: isMobile ? 160 : 220, objectFit: 'cover' }} />
        ) : (
          <div style={{ height: isMobile ? 140 : 200, background: 'linear-gradient(135deg,#ece4d6,#f5efe3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? 48 : 64 }}>🍽️</div>
        )}

        <div style={{ padding: isMobile ? 14 : '24px 28px' }}>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: isMobile ? 20 : 26, fontWeight: 700, color: '#1f5c3f', marginBottom: 6 }}>{product.name}</h1>
          {product.description && <p style={{ color: '#555', fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>{product.description}</p>}

          {product.tags?.length > 0 && <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {product.tags.map(t => <span key={t.id} style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: '#e8f5e9', color: '#1f5c3f' }}>{t.name}</span>)}
          </div>}

          {/* Restaurant card */}
          {product.restaurant && (
            <div style={{ background: '#faf6ee', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1f5c3f' }}>{product.restaurant.name}</div>
              <div style={{ fontSize: 12, color: '#555' }}>
                {product.cuisine || product.restaurant.cuisine || ''}{product.restaurant.city && ` · ${product.restaurant.city}`}{product.restaurant.address && ` · ${product.restaurant.address}`}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12, fontSize: 13 }}>
            <div><b>Pickup:</b> {product.pickup_time || 'TBD'}</div>
            <div><b>Window:</b> {product.pickup_duration_mins || 30} mins</div>
            <div><b>Dietary:</b> {product.dietary_info || '—'}</div>
            <div><b>Available:</b> {product.quantity} left</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#1f5c3f' }}>${Number(product.price || 0).toFixed(2)}</span>
          </div>

          {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: 10, color: '#ef4444', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</div>}

          {claimed ? (
            <div>
              <div style={{ background: '#e8f5e9', border: '1px solid #4ade80', borderRadius: 10, padding: 14, color: '#166534', textAlign: 'center', marginBottom: 12 }}>
                Order placed ({qty}x)! Pick up from <b>{product.restaurant?.name}</b>{scheduledPickup && ` at ${scheduledPickup}`}.
              </div>
              <Link to="/dashboard" style={{ display: 'block', padding: 12, borderRadius: 10, background: '#1f5c3f', color: '#fff', fontWeight: 700, fontSize: 14, textAlign: 'center', textDecoration: 'none' }}>View My Orders</Link>
            </div>
          ) : confirm ? (
            /* Confirmation popup */
            <div style={{ background: '#faf6ee', border: '1px solid #ddd2bf', borderRadius: 14, padding: 16, marginBottom: 12 }}>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Confirm your order?</p>
              <p style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>{qty}x {product.name} = <b>${(qty * product.price).toFixed(2)}</b> from {product.restaurant?.name}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleClaim} disabled={claiming} style={{ flex: 1, padding: 10, borderRadius: 10, border: 'none', background: '#1f5c3f', color: '#fff', fontWeight: 700, cursor: 'pointer', opacity: claiming ? .6 : 1 }}>{claiming ? 'Placing...' : 'Yes, Order'}</button>
                <button onClick={() => setConfirm(false)} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #ddd2bf', background: '#fffdf8', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              {/* Qty selector */}
              {accountType !== 'restaurant' && user && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                  <label style={{ fontSize: 13, fontWeight: 600 }}>Qty:</label>
                  <select value={qty} onChange={e => setQty(parseInt(e.target.value))}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #c8bea9', background: '#fffdf8', fontSize: 14 }}>
                    {Array.from({ length: Math.min(product.quantity, 10) }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <label style={{ fontSize: 13, fontWeight: 600, marginLeft: 'auto' }}>Schedule pickup:</label>
                  <input value={scheduledPickup} onChange={e => setScheduledPickup(e.target.value)} placeholder="e.g. 7 PM"
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #c8bea9', background: '#fffdf8', fontSize: 13, width: 100 }} />
                </div>
              )}
              <button onClick={() => { if (!user) { nav('/login'); return; } if (accountType === 'restaurant') { setError('Restaurants cannot order.'); return; } setConfirm(true); }}
                style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: '#1f5c3f', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                {!user ? 'Login to Claim' : accountType === 'restaurant' ? 'Restaurants Can\'t Order' : `Claim ${qty}x — $${(qty * product.price).toFixed(2)}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
