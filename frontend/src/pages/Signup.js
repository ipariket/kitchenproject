import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { registerUser } from '../api/api';

export default function Signup() {
  const { handleLogin } = useContext(AuthContext);
  const [f, setF] = useState({ username: '', email: '', password: '', city: '', restaurant_name: '', cuisine: '', address: '' });
  const [type, setType] = useState('customer');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!f.username || !f.password) { setErr('Username and password are required.'); return; }
    if (type === 'restaurant' && !f.restaurant_name) { setErr('Restaurant name is required.'); return; }
    setErr(''); setBusy(true);
    try {
      const r = await registerUser({ ...f, account_type: type });
      handleLogin(r.data.token, r.data.user, r.data.account_type);
    } catch (e) {
      const d = e.response?.data;
      setErr(d ? Object.entries(d).map(([k, v]) => `${k}: ${[].concat(v).join(', ')}`).join(' | ') : 'Registration failed.');
    } finally { setBusy(false); }
  };

  const Req = () => <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: 16 }}>
      <div style={{ background: '#fffdf8', border: '1px solid #ddd2bf', borderRadius: 18, padding: '32px 24px', width: '100%', maxWidth: 400 }}>
        <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 24, fontWeight: 700, color: '#1f5c3f', textAlign: 'center', marginBottom: 4 }}>Kitchen<span style={{ color: '#5A9F68' }}>Share</span></div>
        <p style={{ textAlign: 'center', color: '#555', fontSize: 13, marginBottom: 20 }}>Create your account</p>
        {err && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: 10, color: '#ef4444', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{err}</div>}

        <label style={L}>Account Type<Req /></label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {['customer', 'restaurant'].map(t => (
            <div key={t} onClick={() => setType(t)} style={{ padding: 10, borderRadius: 10, border: `2px solid ${type === t ? '#1f5c3f' : '#ddd2bf'}`, background: type === t ? '#e8f5e9' : '#fffdf8', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: 20 }}>{t === 'customer' ? '🍽️' : '👨‍🍳'}</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{t === 'customer' ? 'Customer' : 'Restaurant'}</div>
            </div>
          ))}
        </div>

        <label style={L}>Username<Req /></label><input style={I} placeholder="Username" value={f.username} onChange={e => set('username', e.target.value)} />
        <label style={L}>Email</label><input style={I} type="email" placeholder="Email" value={f.email} onChange={e => set('email', e.target.value)} />
        <label style={L}>Password<Req /></label><input style={I} type="password" placeholder="Min 4 characters" value={f.password} onChange={e => set('password', e.target.value)} />
        <label style={L}>City</label><input style={I} placeholder="Your city" value={f.city} onChange={e => set('city', e.target.value)} />

        {type === 'restaurant' && (<>
          <label style={L}>Restaurant Name<Req /></label><input style={I} placeholder="Kitchen name" value={f.restaurant_name} onChange={e => set('restaurant_name', e.target.value)} />
          <label style={L}>Cuisine Type</label><input style={I} placeholder="e.g. Indian, Mexican, Italian" value={f.cuisine} onChange={e => set('cuisine', e.target.value)} />
          <label style={L}>Address</label><input style={I} placeholder="Street address" value={f.address} onChange={e => set('address', e.target.value)} />
        </>)}

        <p style={{ fontSize: 11, color: '#999', marginBottom: 10 }}><span style={{ color: '#ef4444' }}>*</span> Required fields</p>
        <button onClick={submit} disabled={busy} style={{ ...B, opacity: busy ? .6 : 1 }}>{busy ? 'Creating...' : 'Sign Up'}</button>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#555' }}>Have an account? <Link to="/login" style={{ color: '#1f5c3f', fontWeight: 600 }}>Login</Link></p>
      </div>
    </div>
  );
}
const L = { display: 'block', fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 4 };
const I = { width: '100%', padding: '10px 12px', border: '1px solid #c8bea9', borderRadius: 10, background: '#fffdf8', fontSize: 14, fontFamily: "'DM Sans',sans-serif", marginBottom: 14, outline: 'none' };
const B = { width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#1f5c3f', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" };
