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

export const AuthContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile().then(r => { setUser(r.data.user); setAccountType(r.data.account_type); })
        .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('accountType'); })
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const handleLogin = (token, userData, type) => {
    localStorage.setItem('token', token);
    localStorage.setItem('accountType', type);
    setUser(userData);
    setAccountType(type);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accountType');
    setUser(null);
    setAccountType(null);
  };

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#f5efe3', fontSize:24, fontWeight:700, color:'#1f5c3f' }}>KitchenShare</div>;

  return (
    <AuthContext.Provider value={{ user, accountType, handleLogin, handleLogout }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to={accountType === 'restaurant' ? '/dashboard' : '/'} /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to={accountType === 'restaurant' ? '/dashboard' : '/'} /> : <Signup />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/create-offer" element={user ? <CreateOffer /> : <Navigate to="/login" />} />
          <Route path="/offer/:id" element={<OfferDetail />} />
          <Route path="/kitchen/:id" element={<KitchenProfile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
export default App;
