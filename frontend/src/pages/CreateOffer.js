import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { createProduct } from '../api/api';
import useWindowSize from '../components/useWindowSize';

export default function CreateOffer() {
  const { accountType } = useContext(AuthContext);
  const nav = useNavigate();
  const { isMobile } = useWindowSize();
  const [f, setF] = useState({ name: '', description: '', price: '', quantity: '1', pickup_time: '', pickup_duration_mins: '30', dietary_info: '', cuisine: '' });
  const [img, setImg] = useState(null); const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false); const [ok, setOk] = useState(false); const [err, setErr] = useState('');

  if (accountType !== 'restaurant') return <Navigate to="/dashboard" />;

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const pickImg = (e) => { const file = e.target.files[0]; if (file) { setImg(file); const r = new FileReader(); r.onloadend = () => setPreview(r.result); r.readAsDataURL(file); } };

  const submit = async () => {
    if (!f.name) { setErr('Dish name is required.'); return; }
    if (!f.price || parseFloat(f.price) <= 0) { setErr('Price is required.'); return; }
    setErr(''); setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(f).forEach(([k, v]) => fd.append(k, v));
      fd.append('category', 'Pickup');
      if (img) fd.append('image', img);
      await createProduct(fd);
      setOk(true); setTimeout(() => nav('/dashboard'), 1500);
    } catch (e) { setErr(e.response?.data ? JSON.stringify(e.response.data) : 'Failed to create offer.'); }
    finally { setBusy(false); }
  };

  const Req = () => <span style={{ color: '#ef4444' }}>*</span>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: isMobile ? 10 : 32 }}>
      <div style={{ background: '#fffdf8', border: '1px solid #ddd2bf', borderRadius: 18, padding: isMobile ? '20px 14px' : '32px 28px', width: '100%', maxWidth: 520 }}>
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: isMobile ? 20 : 24, fontWeight: 700, color: '#1f5c3f', marginBottom: 4 }}>Post Food Offer</h2>
        <p style={{ color: '#555', fontSize: 13, marginBottom: 20 }}>Fill in the details. <span style={{ color: '#ef4444' }}>*</span> = required</p>
        {ok && <div style={{ background: '#e8f5e9', border: '1px solid #4ade80', borderRadius: 10, padding: 10, color: '#166534', textAlign: 'center', marginBottom: 12 }}>Posted! Redirecting...</div>}
        {err && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: 10, color: '#ef4444', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{err}</div>}

        <label style={L}>Photo</label>
        {preview ? <><img src={preview} alt="" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 10 }} /><button onClick={() => { setImg(null); setPreview(null); }} style={{ width: '100%', padding: 8, borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer', marginBottom: 12 }}>Remove</button></>
          : <label style={{ display: 'block', border: '2px dashed #c8bea9', borderRadius: 14, padding: 16, textAlign: 'center', cursor: 'pointer', marginBottom: 12, background: '#faf6ee' }}>📷 Upload photo<input type="file" accept="image/*" onChange={pickImg} style={{ display: 'none' }} /></label>}

        <label style={L}>Dish Name<Req /></label><input style={I} placeholder="e.g. Chicken Tikka" value={f.name} onChange={e => set('name', e.target.value)} />
        <label style={L}>Description</label><textarea style={{ ...I, minHeight: 60, resize: 'vertical' }} placeholder="Describe your dish, ingredients, etc." value={f.description} onChange={e => set('description', e.target.value)} />
        <label style={L}>Cuisine<Req /></label><input style={I} placeholder="e.g. Indian, Mexican, Nepali, Other" value={f.cuisine} onChange={e => set('cuisine', e.target.value)} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div><label style={L}>Price ($)<Req /></label><input style={I} type="number" step="0.01" placeholder="12.99" value={f.price} onChange={e => set('price', e.target.value)} /></div>
          <div><label style={L}>Quantity<Req /></label><input style={I} type="number" min="1" placeholder="5" value={f.quantity} onChange={e => set('quantity', e.target.value)} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div><label style={L}>Pickup Time</label><input style={I} placeholder="6:00 PM" value={f.pickup_time} onChange={e => set('pickup_time', e.target.value)} /></div>
          <div><label style={L}>Pickup Window (mins)</label><input style={I} type="number" min="5" placeholder="30" value={f.pickup_duration_mins} onChange={e => set('pickup_duration_mins', e.target.value)} /></div>
        </div>
        <label style={L}>Dietary Info</label><input style={I} placeholder="Halal, Vegan, Gluten-Free, etc." value={f.dietary_info} onChange={e => set('dietary_info', e.target.value)} />

        <button onClick={submit} disabled={busy} style={{ width: '100%', padding: 13, borderRadius: 10, border: 'none', background: '#1f5c3f', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: busy ? .6 : 1, fontFamily: "'DM Sans',sans-serif" }}>{busy ? 'Posting...' : 'Post Offer'}</button>
      </div>
    </div>
  );
}
const L = { display: 'block', fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 4 };
const I = { width: '100%', padding: '10px 12px', border: '1px solid #c8bea9', borderRadius: 10, background: '#fffdf8', fontSize: 14, fontFamily: "'DM Sans',sans-serif", marginBottom: 12, outline: 'none' };
