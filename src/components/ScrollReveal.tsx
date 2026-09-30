import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ScrollContext } from '../ScrollContext';
import { SectionContext } from '../context/SectionContext';

interface ScrollRevealProps {
 children: React.ReactNode;
 stagger?: number;
 className?: string;
 isActive?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = "", isActive: propIsActive }) => {
 const { index, isActive: contextIsActive } = useContext(SectionContext);
 
 const isActive = index !== -1 ? contextIsActive : (propIsActive || false);

 // Recursively add isActive prop to RevealItem components (legacy support)
 const childrenWithProps = React.Children.map(children, (child) => {
 if (React.isValidElement(child)) {
 const componentName = (child.type as any).displayName || (child.type as any).name;
 if (componentName === 'RevealItem') {
 return React.cloneElement(child, { isActive } as any);
 }
 }
 return child;
 });

 return (
 <div className={className}>
 {childrenWithProps}
 </div>
 );
};

ScrollReveal.displayName = 'ScrollReveal';

interface RevealItemProps {
 children: React.ReactNode;
 className?: string;
 isActive?: boolean;
 index?: number;
 stagger?: number;
 totalItems?: number;
 entryDelay?: number; // New prop for delaying entry
}

export const RevealItem: React.FC<RevealItemProps> = ({ children, className = "", isActive: propIsActive, index = 0, stagger = 0.0735, totalItems = 0, entryDelay = 0 }) => {
 const { index: sectionIndex, isActive: contextIsActive } = useContext(SectionContext);
 const { currentSectionIndex, scrollDirection } = useContext(ScrollContext);

 const isActive = sectionIndex !== -1 ? contextIsActive : (propIsActive || false);
 
 const relativePosition = sectionIndex !== -1 ? (sectionIndex < currentSectionIndex ? 'above' : 'below') : 'below';

 const delayIndex = (scrollDirection === 'up' && totalItems > 0) ? (totalItems - index) : index;

 const variants = {
 hidden: ({ pos, i, s }: { pos: string, i: number, s: number }) => ({
 opacity: 0,
 y: pos === 'above' ? -100 : 100,
 filter: 'blur(10px)',
 transition: {
 duration: 0.6,
 ease: [0.22, 1, 0.36, 1] as any,
 delay: i * s
 }
 }),
 visible: ({ i, s, d }: { i: number, s: number, d: number }) => ({ 
 opacity: 1, 
 y: 0, 
 filter: 'blur(0px)',
 transition: { 
 duration: 0.8, 
 ease: [0.22, 1, 0.36, 1] as any,
 delay: d + (i * s) // Base entry delay + stagger
 } 
 })
 };

 return (
 <motion.div
 custom={{ pos: relativePosition, i: delayIndex, s: stagger, d: entryDelay }}
 variants={variants}
 initial="hidden"
 animate={isActive ? "visible" : "hidden"}
 className={className}
 >
 {children}
 </motion.div>
 );
};

RevealItem.displayName = 'RevealItem';
