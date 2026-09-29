import React from 'react';

const AmbientBackground: React.FC = () => {
 return (
 <div className="fixed top-0 left-0 w-screen h-screen z-[-1] overflow-hidden pointer-events-none">
 <div className="absolute w-[60vw] h-[60vw] bg-primary/60 rounded-full filter blur-[120px] opacity-60 animate-float top-[-10%] left-[-10%]" />
 <div 
 className="absolute w-[50vw] h-[50vw] bg-orange-400/60 rounded-full filter blur-[120px] opacity-60 animate-float bottom-[-10%] right-[-10%]"
 style={{ animationDelay: '-10s', animationDuration: '25s' }}
 />
 </div>
 );
};

export default AmbientBackground;
