import React, { useState } from 'react';

export default function FilterBar({ tags = [], selectedTags = [], onTagToggle, priceRange = [1, 100], onPriceChange, onApply }) {
  const [showMore, setShowMore] = useState(false);
  const cuisines = ['Mexican', 'Chinese', 'Italian', 'Indian', 'Thai', 'Healthy'];

  const chip = (label, active, onClick) => (
    <span key={label} onClick={onClick} style={{
      padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
      whiteSpace: 'nowrap', flexShrink: 0, fontFamily: "'DM Sans',sans-serif",
      border: `1px solid ${active ? '#1f5c3f' : '#ddd2bf'}`,
      background: active ? '#1f5c3f' : '#fffdf8', color: active ? '#fff' : '#333',
    }}>{label}</span>
  );

  return (
    <div style={{ marginBottom: 14 }}>
      <div className="hide-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        {cuisines.map(c => chip(c, selectedTags.includes(c), () => onTagToggle?.(c)))}
        {chip('⚙ More', showMore, () => setShowMore(!showMore))}
      </div>
      {showMore && (
        <div style={{ background: '#fffdf8', border: '1px solid #ddd2bf', borderRadius: 14, padding: 14, marginTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', marginBottom: 8 }}>All tags</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {tags.map(t => chip(t.name, selectedTags.includes(t.id), () => onTagToggle?.(t.id)))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', marginBottom: 6 }}>Max price: ${priceRange[1]}</div>
          <input type="range" min="1" max="100" value={priceRange[1]} onChange={e => onPriceChange?.([1, +e.target.value])} style={{ width: '100%', accentColor: '#1f5c3f', marginBottom: 10 }} />
          <button onClick={() => { onApply?.(); setShowMore(false); }} style={{ width: '100%', padding: 10, borderRadius: 10, border: 'none', background: '#1f5c3f', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Apply</button>
        </div>
      )}
    </div>
  );
}
