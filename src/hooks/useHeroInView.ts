import { useState, useEffect } from 'react';

export const useHeroInView = (elementId: string, rootId?: string) => {
 const [isHeroInView, setIsHeroInView] = useState(true);

 useEffect(() => {
 let observer: IntersectionObserver | null = null;
 let intervalId: NodeJS.Timeout | null = null;

 const setupObserver = () => {
 const element = document.getElementById(elementId);
 if (!element) return false;

 const root = rootId ? document.getElementById(rootId) : document.getElementById('main-scroll-container');

 observer = new IntersectionObserver(
 ([entry]) => {
 setIsHeroInView(entry.isIntersecting);
 },
 { 
 root: root,
 threshold: 0,
 rootMargin: "-10% 0px 0px 0px" 
 }
 );

 observer.observe(element);
 return true;
 };

 if (!setupObserver()) {
 intervalId = setInterval(() => {
 if (setupObserver()) {
 if (intervalId) clearInterval(intervalId);
 }
 }, 100);
 }

 return () => {
 if (intervalId) clearInterval(intervalId);
 if (observer) observer.disconnect();
 };
 }, [elementId, rootId]);

 return isHeroInView;
};
