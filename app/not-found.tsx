import React from 'react';
import { Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg p-6 text-center">
      <Sparkles size={48} className="opacity-20 mb-4 text-accent" />
      <h1 className="text-[28px] font-bold font-disp text-text mb-2">404</h1>
      <p className="text-[14px] font-head tracking-wider uppercase text-text-sub">
        The universe is empty here.
      </p>
    </div>
  );
}
