import React, { useRef, useEffect, useCallback } from 'react';
import useWindowSize from './useWindowSize';

export default function FoodCarousel({ items = [], onItemClick }) {
  const ref = useRef(null);
  const timer = useRef(null);
  const { isMobile } = useWindowSize();

  const start = useCallback(() => {
    if (isMobile || items.length < 4) return;
    timer.current = setInterval(() => {
      const c = ref.current; if (!c) return;
      if (c.scrollLeft + c.clientWidth >= c.scrollWidth - 10) c.scrollTo({ left: 0, behavior: 'smooth' });
      else c.scrollBy({ left: 230, behavior: 'smooth' });
    }, 3000);
  }, [isMobile, items.length]);
  const stop = useCallback(() => clearInterval(timer.current), []);

  useEffect(() => { start(); return stop; }, [start, stop]);

  if (!items.length) return null;

  if (isMobile) {
    return (
      <div style={{ background: 'linear-gradient(135deg,#1f5c3f,#2d7a53)', borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>🔥 Today's Picks</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {items.slice(0, 4).map((item, i) => (
            <div key={i} onClick={() => onItemClick?.(item)} style={{ background: '#fffdf8', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, background: 'linear-gradient(135deg,#ece4d6,#f5efe3)' }}>{item.emoji || '🍽️'}</div>
              <div style={{ padding: '6px 8px' }}>
                <div style={{ fontWeight: 700, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                <div style={{ fontSize: 10, color: '#555' }}>{item.restaurant?.name}</div>
                {item.price > 0 && <div style={{ fontWeight: 700, fontSize: 13, color: '#1f5c3f', marginTop: 2 }}>${Number(item.price).toFixed(2)}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg,#1f5c3f,#2d7a53)', borderRadius: 16, padding: '20px 16px', position: 'relative', marginBottom: 20 }}
      onMouseEnter={stop} onMouseLeave={start}>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 14, fontFamily: "'Playfair Display',Georgia,serif" }}>🔥 Today's Picks</div>
      <button onClick={() => ref.current?.scrollBy({ left: -230, behavior: 'smooth' })} style={arrow('left')}>◀</button>
      <button onClick={() => ref.current?.scrollBy({ left: 230, behavior: 'smooth' })} style={arrow('right')}>▶</button>
      <div ref={ref} className="hide-scroll" style={{ display: 'flex', gap: 14, overflowX: 'auto', scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}>
        {items.map((item, i) => (
          <div key={i} onClick={() => onItemClick?.(item)} style={{ flex: '0 0 200px', background: '#fffdf8', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', scrollSnapAlign: 'center' }}>
            <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, background: 'linear-gradient(135deg,#ece4d6,#f5efe3)' }}>{item.emoji || '🍽️'}</div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
              <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>{item.restaurant?.name}</div>
              {item.price > 0 && <div style={{ fontWeight: 700, fontSize: 15, color: '#1f5c3f', marginTop: 4 }}>${Number(item.price).toFixed(2)}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const arrow = (side) => ({
  position: 'absolute', top: '55%', [side === 'left' ? 'left' : 'right']: 8,
  transform: 'translateY(-50%)', background: 'rgba(255,255,255,.9)', border: 'none',
  width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 14, zIndex: 2,
  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.15)',
});
