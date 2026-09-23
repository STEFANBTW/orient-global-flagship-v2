import React from 'react';
import { motion } from 'framer-motion';

interface AmbientGlowProps {
 color: string;
}

export const AmbientGlow: React.FC<AmbientGlowProps> = ({ color }) => {
 return (
 <div className="fixed inset-0 overflow-hidden pointer-events-none z-[0]">
 <motion.div
 animate={{
 scale: [1, 1.2, 1],
 opacity: [0.03, 0.08, 0.03],
 x: [0, 50, 0],
 y: [0, -50, 0],
 }}
 transition={{
 duration: 15,
 repeat: Infinity,
 ease: "easeInOut"
 }}
 className={`absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px] ${color}`}
 />
 <motion.div
 animate={{
 scale: [1, 1.5, 1],
 opacity: [0.02, 0.06, 0.02],
 x: [0, -50, 0],
 y: [0, 50, 0],
 }}
 transition={{
 duration: 20,
 repeat: Infinity,
 ease: "easeInOut",
 delay: 2
 }}
 className={`absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[100px] ${color}`}
 />
 </div>
 );
};
