import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders, getDashboardStats, updateOrderStatus, getMyProducts, editProduct, deleteProduct, deleteAccount } from '../api/api';
import useWindowSize from '../components/useWindowSize';

export default function Dashboard() {
  const { user, accountType, handleLogout } = useContext(AuthContext);
  const { isMobile } = useWindowSize();
  const nav = useNavigate();
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');
  const [editing, setEditing] = useState(null); // product id being edited

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      setOrders(res.data.results || res.data || []);
      if (accountType === 'restaurant') {
        try { setStats((await getDashboardStats()).data); } catch {}
        try { setMyProducts((await getMyProducts()).data || []); } catch {}
      }
    } catch {} finally { setLoading(false); }
  };

  const changeStatus = async (id, s) => { try { await updateOrderStatus(id, { status: s }); loadData(); } catch { alert('Failed'); } };
  const handleDelete = async (id) => { if (window.confirm('Delete this listing permanently?')) { try { await deleteProduct(id); loadData(); } catch { alert('Failed'); } } };
  const handleEdit = async (id, data) => { try { await editProduct(id, data); setEditing(null); loadData(); } catch { alert('Failed'); } };
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure? This will permanently delete your account and all data.')) {
      try { await deleteAccount(); handleLogout(); nav('/'); window.location.reload(); } catch { alert('Failed'); }
    }
  };

  const Badge = ({ status }) => {
    const colors = { Pending: ['#fef3c7','#92400e','#f59e0b'], 'Ready for Pickup': ['#dbeafe','#1e40af','#3b82f6'], 'Picked Up': ['#e0e7ff','#3730a3','#6366f1'], Completed: ['#d1fae5','#065f46','#10b981'], Cancelled: ['#fef2f2','#991b1b','#ef4444'] };
    const [bg, text, dot] = colors[status] || ['#f3f4f6','#374151','#9ca3af'];
    return <span style={{ padding: '3px 10px', borderRadius: 16, fontSize: 11, fontWeight: 600, background: bg, color: text, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />{status}
    </span>;
  };

  // ============ CUSTOMER ============
  if (accountType !== 'restaurant') {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: isMobile ? 10 : 24 }}>
        <h1 style={H1}>🍽️ My Orders</h1>
        {loading ? <p style={{ textAlign: 'center', padding: 40, color: '#555' }}>Loading...</p>
        : orders.length === 0 ? (
          <div style={emptyBox}><div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div><h3>No orders yet</h3>
            <p style={{ color: '#555', fontSize: 14, marginBottom: 16 }}>Browse food and claim an offer!</p>
            <Link to="/" style={greenBtn}>Browse Food</Link></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {orders.map(o => (
              <div key={o.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                  <div><div style={{ fontWeight: 700, fontSize: 16 }}>{o.product?.name || 'Food Item'}</div><div style={{ fontSize: 12, color: '#888' }}>Order #{o.id} · Qty: {o.quantity}</div></div>
                  <Badge status={o.status} />
                </div>
                {o.product?.restaurant && (
                  <div style={{ background: '#faf6ee', borderRadius: 10, padding: '8px 12px', marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1f5c3f' }}>{o.product.restaurant.name}</div>
                    <div style={{ fontSize: 12, color: '#555' }}>{o.product.restaurant.cuisine}{o.product.restaurant.city && ` · ${o.product.restaurant.city}`}</div>
                  </div>
                )}
                <div style={{ fontSize: 13, color: '#555', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <span>{o.product?.pickup_time && `Pickup: ${o.product.pickup_time}`}{o.scheduled_pickup && ` (Scheduled: ${o.scheduled_pickup})`}</span>
                  {o.product?.price && <span style={{ fontWeight: 700, color: '#1f5c3f' }}>${(o.quantity * Number(o.product.price)).toFixed(2)}</span>}
                </div>
                {o.status === 'Pending' && (
                  <button onClick={() => { if (window.confirm('Cancel this order?')) changeStatus(o.id, 'Cancelled'); }}
                    style={{ marginTop: 8, padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: '#fef2f2', color: '#ef4444' }}>Cancel Order</button>
                )}
              </div>
            ))}
          </div>
        )}
        <button onClick={handleDeleteAccount} style={{ marginTop: 40, padding: '8px 16px', borderRadius: 8, fontSize: 12, border: '1px solid #fca5a5', background: '#fffdf8', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>Delete My Account</button>
      </div>
    );
  }

  // ============ RESTAURANT ============
  const statCards = [
    { label: 'Pending', value: stats.pending || 0, color: '#f59e0b' },
    { label: 'Ready', value: stats.ready_for_pickup || 0, color: '#3b82f6' },
    { label: 'Picked Up', value: stats.picked_up || 0, color: '#6366f1' },
    { label: 'Done', value: stats.completed || 0, color: '#10b981' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? 10 : 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <h1 style={H1}>👨‍🍳 Kitchen Dashboard</h1>
        <Link to="/create-offer" style={{ ...greenBtn, textDecoration: 'none' }}>+ Post Food</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 8 : 12, marginBottom: 16 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ ...card, position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: isMobile ? 24 : 32, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em', color: '#888', fontWeight: 600 }}>{s.label}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: s.color }} />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['orders', 'listings'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 10, border: '1px solid #ddd2bf', background: tab === t ? '#1f5c3f' : '#fffdf8', color: tab === t ? '#fff' : '#333', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            {t === 'orders' ? `Orders (${orders.length})` : `My Listings (${myProducts.length})`}
          </button>
        ))}
      </div>

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
          {orders.length === 0 ? <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>No orders yet.</div>
          : orders.map(o => (
            <div key={o.id} style={{ padding: '14px 18px', borderBottom: '1px solid #eee2cf', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{o.product?.name || '—'}</div>
                <div style={{ fontSize: 12, color: '#555' }}>Customer: {o.customer || '?'} · Qty: {o.quantity}{o.scheduled_pickup && ` · Pickup: ${o.scheduled_pickup}`}</div>
              </div>
              <Badge status={o.status} />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {o.status === 'Pending' && <button onClick={() => changeStatus(o.id, 'Ready for Pickup')} style={aBtn('#dbeafe', '#1e40af')}>Mark Ready</button>}
                {o.status === 'Ready for Pickup' && <button onClick={() => changeStatus(o.id, 'Picked Up')} style={aBtn('#e0e7ff', '#3730a3')}>Picked Up</button>}
                {o.status === 'Picked Up' && <button onClick={() => changeStatus(o.id, 'Completed')} style={aBtn('#d1fae5', '#065f46')}>Complete</button>}
                {o.status === 'Completed' && <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>✓ Done</span>}
                {o.status === 'Cancelled' && <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>✗ Cancelled</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LISTINGS TAB */}
      {tab === 'listings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {myProducts.length === 0 ? (
            <div style={{ ...emptyBox }}><div style={{ fontSize: 40, marginBottom: 8 }}>🍳</div><p style={{ color: '#555', marginBottom: 16 }}>No listings yet.</p>
              <Link to="/create-offer" style={{ ...greenBtn, textDecoration: 'none' }}>Post Your First Dish</Link></div>
          ) : myProducts.map(p => (
            <div key={p.id} style={{ ...card, display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap', opacity: p.is_available ? 1 : 0.6 }}>
              <div style={{ width: 60, height: 60, borderRadius: 10, background: '#ece4d6', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {(p.image || p.image_url) ? <img src={p.image_url || p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🍽️'}
              </div>
              {editing === p.id ? (
                <EditForm product={p} onSave={(data) => handleEdit(p.id, data)} onCancel={() => setEditing(null)} />
              ) : (
                <>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#555' }}>${Number(p.price || 0).toFixed(2)} · Qty: {p.quantity} · {p.cuisine || 'No cuisine'} · {p.pickup_time || 'No time'}</div>
                    <div style={{ fontSize: 11, color: p.is_available ? '#10b981' : '#ef4444', fontWeight: 600, marginTop: 2 }}>{p.is_available ? '● Available' : '● Hidden'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => setEditing(p.id)} style={aBtn('#dbeafe', '#1e40af')}>Edit</button>
                    <button onClick={() => handleEdit(p.id, { is_available: !p.is_available })} style={aBtn(p.is_available ? '#fef3c7' : '#d1fae5', p.is_available ? '#92400e' : '#065f46')}>{p.is_available ? 'Hide' : 'Show'}</button>
                    <button onClick={() => handleDelete(p.id)} style={aBtn('#fef2f2', '#ef4444')}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={handleDeleteAccount} style={{ marginTop: 40, padding: '8px 16px', borderRadius: 8, fontSize: 12, border: '1px solid #fca5a5', background: '#fffdf8', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>Delete My Account</button>
    </div>
  );
}

// Inline edit form for product
function EditForm({ product, onSave, onCancel }) {
  const [f, setF] = useState({ name: product.name, price: product.price, quantity: product.quantity, pickup_time: product.pickup_time || '', pickup_duration_mins: product.pickup_duration_mins || 30, dietary_info: product.dietary_info || '', cuisine: product.cuisine || '', description: product.description || '' });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ flex: 1, minWidth: 200 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
        <input value={f.name} onChange={e => set('name', e.target.value)} placeholder="Name" style={eI} />
        <input value={f.cuisine} onChange={e => set('cuisine', e.target.value)} placeholder="Cuisine" style={eI} />
        <input type="number" value={f.price} onChange={e => set('price', e.target.value)} placeholder="Price" style={eI} />
        <input type="number" value={f.quantity} onChange={e => set('quantity', e.target.value)} placeholder="Qty" style={eI} />
        <input value={f.pickup_time} onChange={e => set('pickup_time', e.target.value)} placeholder="Pickup time" style={eI} />
        <input value={f.dietary_info} onChange={e => set('dietary_info', e.target.value)} placeholder="Dietary" style={eI} />
      </div>
      <textarea value={f.description} onChange={e => set('description', e.target.value)} placeholder="Description" style={{ ...eI, width: '100%', minHeight: 40, resize: 'vertical', marginBottom: 8 }} />
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => onSave(f)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#1f5c3f', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Save</button>
        <button onClick={onCancel} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #ddd2bf', background: '#fffdf8', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
}

const H1 = { fontFamily: "'Playfair Display',Georgia,serif", fontSize: 24, fontWeight: 700, color: '#1f5c3f', marginBottom: 20 };
const card = { background: '#fffdf8', border: '1px solid #ddd2bf', borderRadius: 14, padding: 16 };
const emptyBox = { ...card, padding: 32, textAlign: 'center' };
const greenBtn = { display: 'inline-block', padding: '10px 20px', borderRadius: 10, background: '#1f5c3f', color: '#fff', fontWeight: 700, fontSize: 14 };
const aBtn = (bg, color) => ({ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: bg, color, fontFamily: "'DM Sans',sans-serif" });
const eI = { padding: '6px 8px', borderRadius: 6, border: '1px solid #c8bea9', fontSize: 12, outline: 'none', fontFamily: "'DM Sans',sans-serif" };
