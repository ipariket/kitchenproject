import { useState, useEffect } from 'react';
export default function useWindowSize() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    let t;
    const h = () => { clearTimeout(t); t = setTimeout(() => setW(window.innerWidth), 80); };
    window.addEventListener('resize', h);
    return () => { window.removeEventListener('resize', h); clearTimeout(t); };
  }, []);
  return { width: w, isMobile: w < 768, isDesktop: w >= 1024 };
}
