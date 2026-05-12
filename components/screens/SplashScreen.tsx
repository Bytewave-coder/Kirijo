import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNav } from '../AppScreens';

export function SplashScreen() {
  const { navigate } = useNav();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate('home');
    }, 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <motion.div 
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black z-[999] flex flex-col items-center justify-center p-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-accent text-[80px] leading-none font-bold"
        style={{ textShadow: "0 0 20px color-mix(in srgb, var(--color-accent) 50%, transparent), 0 0 50px color-mix(in srgb, var(--color-accent) 30%, transparent)" }}
      >
        ✦
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="font-disp text-[42px] font-black tracking-[0.15em] text-text mt-4"
      >
        KIRIJO
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="font-head text-[14px] tracking-[4px] uppercase text-text mt-1"
      >
        WISH JOURNAL
      </motion.div>
      
      <div className="w-[80px] h-[2px] bg-white/10 rounded-full mt-10 overflow-hidden relative">
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.2 }}
          className="absolute top-0 bottom-0 w-full bg-accent shadow-[0_0_10px_var(--color-accent)]"
        />
      </div>
    </motion.div>
  );
}
