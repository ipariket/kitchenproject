import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { loginUser } from '../api/api';

export default function Login() {
  const { handleLogin } = useContext(AuthContext);
  const [u, setU] = useState(''); const [p, setP] = useState('');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(''); setBusy(true);
    try { const r = await loginUser({ username: u, password: p }); handleLogin(r.data.token, r.data.user, r.data.account_type); }
    catch (e) { setErr(e.response?.data?.error || 'Login failed. Check your credentials.'); }
    finally { setBusy(false); }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: 16 }}>
      <div style={{ background: '#fffdf8', border: '1px solid #ddd2bf', borderRadius: 18, padding: '32px 24px', width: '100%', maxWidth: 360 }}>
        <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 24, fontWeight: 700, color: '#1f5c3f', textAlign: 'center', marginBottom: 4 }}>Kitchen<span style={{ color: '#5A9F68' }}>Share</span></div>
        <p style={{ textAlign: 'center', color: '#555', fontSize: 13, marginBottom: 20 }}>Welcome back!</p>
        {err && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: 10, color: '#ef4444', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{err}</div>}
        <label style={L}>Username</label><input style={I} placeholder="Username" value={u} onChange={e => setU(e.target.value)} />
        <label style={L}>Password</label><input style={I} type="password" placeholder="Password" value={p} onChange={e => setP(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
        <button onClick={submit} disabled={busy} style={{ ...B, opacity: busy ? .6 : 1 }}>{busy ? 'Signing in...' : 'Login'}</button>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#555' }}>No account? <Link to="/signup" style={{ color: '#1f5c3f', fontWeight: 600 }}>Sign up</Link></p>
      </div>
    </div>
  );
}
const L = { display: 'block', fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 4 };
const I = { width: '100%', padding: '10px 12px', border: '1px solid #c8bea9', borderRadius: 10, background: '#fffdf8', fontSize: 14, fontFamily: "'DM Sans',sans-serif", marginBottom: 14, outline: 'none' };
const B = { width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#1f5c3f', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" };
