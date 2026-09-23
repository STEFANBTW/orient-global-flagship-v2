import React, { useContext, useEffect, useRef } from 'react';
import { ScrollContext } from '../ScrollContext';
import { SectionContext } from '../context/SectionContext';

interface SectionWrapperProps {
 id: string;
 children: React.ReactNode;
 className?: string;
 index: number;
 noSnap?: boolean;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, children, className, index, noSnap = false }) => {
 const { setCurrentSectionIndex, setActiveSectionId } = useContext(ScrollContext);
 const { currentSectionIndex } = useContext(ScrollContext);
 const isActive = currentSectionIndex === index;
 const ref = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const observer = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting) {
 setCurrentSectionIndex(index);
 setActiveSectionId(id);
 }
 },
 { threshold: 0.1 }
 );

 if (ref.current) {
 observer.observe(ref.current);
 }

 return () => observer.disconnect();
 }, [index, id, setCurrentSectionIndex, setActiveSectionId]);

 return (
 <SectionContext.Provider value={{ index, isActive }}>
 <div 
 ref={ref}
 id={id} 
 className={`cinematic-section snap-start ${className}`}
 >
 {children}
 </div>
 </SectionContext.Provider>
 );
};
