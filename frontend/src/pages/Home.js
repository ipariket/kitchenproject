import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { getProducts, getTags } from '../api/api';
import FoodCarousel from '../components/FoodCarousel';
import FilterBar from '../components/FilterBar';
import FoodCard from '../components/FoodCard';
import useWindowSize from '../components/useWindowSize';

export default function Home() {
  const { user, accountType } = useContext(AuthContext);
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const { isMobile } = useWindowSize();
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState([]);
  const [price, setPrice] = useState([1, 100]);
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const search = sp.get('search') || '';

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (cityFilter) params.city = cityFilter;
      const cuisineFilters = selected.filter(s => typeof s === 'string');
      if (cuisineFilters.length) params.cuisine = cuisineFilters[0];
      const tagIds = selected.filter(s => typeof s === 'number');
      if (tagIds.length) params.tags = tagIds.join(',');

      const [prodRes, tagRes] = await Promise.all([getProducts(params), getTags()]);
      let items = prodRes.data.results || prodRes.data || [];
      items = items.filter(p => (p.price || 0) <= price[1]);
      setProducts(items);
      setTags(tagRes.data.results || tagRes.data || []);
    } catch (err) { console.log(err); setProducts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [search, selected, price, cityFilter]);

  const toggle = (t) => setSelected(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? 10 : '20px 24px' }}>
      {products.length > 0 && <FoodCarousel items={products} onItemClick={p => nav(`/offer/${p.id}`)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#1f5c3f' }}>
          {search ? `Results for "${search}"` : 'Available Now'}
        </h2>
        {accountType === 'restaurant' && <Link to="/create-offer" style={{ padding: '8px 16px', borderRadius: 10, background: '#1f5c3f', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>+ Post Food</Link>}
      </div>

      {/* City filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <input value={cityFilter} onChange={e => setCityFilter(e.target.value)} placeholder="Filter by city..."
          style={{ padding: '7px 12px', border: '1px solid #c8bea9', borderRadius: 10, background: '#fffdf8', fontSize: 13, outline: 'none', flex: 1, minWidth: 140, maxWidth: 220, fontFamily: "'DM Sans',sans-serif" }} />
        {cityFilter && <button onClick={() => setCityFilter('')} style={{ padding: '7px 12px', borderRadius: 10, border: '1px solid #ddd2bf', background: '#fffdf8', fontSize: 12, cursor: 'pointer', color: '#ef4444', fontWeight: 600 }}>Clear</button>}
      </div>

      <FilterBar tags={tags} selectedTags={selected} onTagToggle={toggle} priceRange={price} onPriceChange={setPrice} onApply={loadData} />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map(i => <div key={i} style={{ height: 76, borderRadius: 14, background: '#ece4d6' }} />)}
        </div>
      ) : products.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {products.map(p => <FoodCard key={p.id} product={p} onClick={() => nav(`/offer/${p.id}`)} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
          <h3 style={{ marginBottom: 8 }}>No food available</h3>
          <p style={{ color: '#555', fontSize: 14 }}>{accountType === 'restaurant' ? 'Post your first food offer!' : 'Check back soon!'}</p>
          {accountType === 'restaurant' && <Link to="/create-offer" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', borderRadius: 10, background: '#1f5c3f', color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Create Offer</Link>}
        </div>
      )}
    </div>
  );
}
