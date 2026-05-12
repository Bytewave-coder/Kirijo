import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function TopBar({ title, onBack, rightAction }: { title: React.ReactNode, onBack?: () => void, rightAction?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-bg/90 backdrop-blur-xl border-b border-white/5 shrink-0 relative z-10">
      {onBack && (
        <button onClick={onBack} className="w-9 h-9 rounded-xl border border-border2 bg-surface text-text flex items-center justify-center transition-all active:scale-90 active:bg-surface2 shrink-0">
          <ChevronLeft size={18} />
        </button>
      )}
      {!onBack && <div className="w-[7px] h-[7px] bg-accent rounded-full shadow-[0_0_8px_var(--accent),0_0_20px_rgba(57,255,20,0.5)] animate-[glow-pulse_2.4s_ease-in-out_infinite] shrink-0" />}
      <div className="font-disp text-base font-bold flex-1 tracking-wider gradient-text">{title}</div>
      {rightAction}
    </div>
  );
}

export function AmbientOrbs() {
  return (
    <>
      <div className="absolute w-[350px] h-[350px] -top-[120px] -left-[120px] rounded-full pointer-events-none z-0" 
        style={{
          background: 'radial-gradient(circle, var(--color-accent-dim) 0%, transparent 65%)',
          animation: 'orb-drift 10s ease-in-out infinite'
        }} 
      />
      <div className="absolute w-[280px] h-[280px] -bottom-[80px] -right-[80px] rounded-full pointer-events-none z-0" 
        style={{
          background: 'radial-gradient(circle, var(--color-accent-dim) 0%, transparent 65%)',
          animation: 'orb-drift 13s ease-in-out infinite reverse'
        }} 
      />
      <style>{`
        @keyframes orb-drift {
          0%,100% { transform: scale(1) translate(0,0); }
          33%     { transform: scale(1.1) translate(15px,-10px); }
          66%     { transform: scale(0.95) translate(-10px,15px); }
        }
        @keyframes glow-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.75); }
        }
      `}</style>
    </>
  );
}

