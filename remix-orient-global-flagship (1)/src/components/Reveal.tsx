import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface RevealProps {
 children: ReactNode;
 animation?: 'slide-up' | 'slide-in-right' | 'slide-from-left' | 'slide-from-right' | 'rotate-in' | string;
 delay?: string | number;
 className?: string;
 style?: React.CSSProperties;
 layout?: boolean | "position" | "size" | "preserve-aspect";
 threshold?: number;
 triggerOnce?: boolean;
 isActive?: boolean; // New prop
}

const Reveal: React.FC<RevealProps> = ({
 children,
 animation = 'slide-up',
 delay = 0,
 className = '',
 style,
 layout = false,
 threshold = 0.2,
 triggerOnce = false,
 isActive = true, // Default to true
}) => {
 // Parse delay string to number (e.g., 'delay-150' -> 0.15)
 let delayNum = typeof delay === 'number' ? delay : 0;
 if (typeof delay === 'string' && delay.startsWith('delay-')) {
 delayNum = parseInt(delay.replace('delay-', ''), 10) / 1000;
 }

 // Tighten delay multiplier for a fluid, domino-like cascade
 const intenseDelay = delayNum * 0.1;

 const variants: Variants = {
 hidden: { 
 opacity: 0, 
 y: 150, 
 transition: { duration: 0.6, ease: "easeOut", delay: intenseDelay * 0.2 } 
 }, 
 visible: { 
 opacity: 1, 
 y: 0, 
 transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any, delay: intenseDelay } 
 },
 };

 return (
 <motion.div
 variants={variants}
 initial="hidden"
 animate={isActive ? "visible" : "hidden"}
 className={className}
 style={style}
 layout={layout}
 >
 {children}
 </motion.div>
 );
};

export default Reveal;
