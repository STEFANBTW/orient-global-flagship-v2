import { useEffect, useRef } from 'react';

export function useParallax() {
 const ref = useRef<HTMLDivElement>(null);

 useEffect(() => {
 let scrollY = window.scrollY;
 let ticking = false;

 const updateParallax = () => {
 if (ref.current) {
 const speed = parseFloat(ref.current.getAttribute('data-speed') || '0');
 const yPos = -(scrollY * speed);
 ref.current.style.transform = `translate3d(0, ${yPos}px, 0)`;
 }
 ticking = false;
 };

 const onScroll = () => {
 scrollY = window.scrollY;
 if (!ticking) {
 window.requestAnimationFrame(updateParallax);
 ticking = true;
 }
 };

 window.addEventListener('scroll', onScroll);
 return () => window.removeEventListener('scroll', onScroll);
 }, []);

 return ref;
}
