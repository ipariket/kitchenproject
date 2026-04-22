import React from 'react';

export default function Sidebar({ items = [], children }) {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#fffdf8', border: '1px solid #ddd2bf', borderRadius: 14, padding: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Menu</div>
        {items.map((item, i) => (
          <a key={i} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 10,
            border: `1px solid ${item.active ? '#1f5c3f' : '#eee2cf'}`, marginBottom: 6,
            background: item.active ? '#efe7d6' : '#fffdf8', fontWeight: item.active ? 700 : 400, fontSize: 13, color: '#111',
          }}><span>{item.icon}</span>{item.label}</a>
        ))}
      </div>
      {children}
    </aside>
  );
}
