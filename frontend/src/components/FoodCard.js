import React from 'react';

export default function FoodCard({ product, onClick }) {
  const imgSrc = product.image_url || product.image;

  return (
    <div onClick={() => onClick?.(product)} style={{ background: '#fffdf8', border: '1px solid #ddd2bf', borderRadius: 14, padding: 12, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
      <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg,#ece4d6,#f5efe3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        {imgSrc ? <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🍽️'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
        <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>
          {product.restaurant?.name || 'Kitchen'}
          {(product.cuisine || product.restaurant?.cuisine) && ` · ${product.cuisine || product.restaurant?.cuisine}`}
          {product.restaurant?.city && ` · ${product.restaurant.city}`}
          {product.pickup_time && ` · ${product.pickup_time}`}
        </div>
        {product.tags?.length > 0 && <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
          {product.tags.slice(0, 3).map(t => <span key={t.id} style={{ padding: '1px 6px', borderRadius: 10, fontSize: 10, fontWeight: 600, background: '#e8f5e9', color: '#1f5c3f' }}>{t.name}</span>)}
        </div>}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {product.price > 0 && <div style={{ fontWeight: 700, fontSize: 15, color: '#1f5c3f' }}>${Number(product.price).toFixed(2)}</div>}
        {product.quantity > 0 && <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{product.quantity} left</div>}
      </div>
    </div>
  );
}
