import React, { useState } from 'react';
import { Home, Search as SearchIcon, Archive, Settings as SettingsIcon, Plus, ChevronLeft, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from './store';
import { Wish, Category } from '../lib/types';
import { TopBar, AmbientOrbs, cn } from './ui';

export type ScreenId = 'splash' | 'home' | 'search' | 'archive' | 'settings' | 'add' | 'detail';

type NavContextType = {
  current: ScreenId;
  navigate: (screen: ScreenId) => void;
  goBack: () => void;
  openDetail: (id: string) => void;
  openAdd: (id?: string) => void;
  detailId: string | null;
  editingId: string | null;
  showToast: (msg: string) => void;
};

export const NavContext = React.createContext<NavContextType | null>(null);

export const useNav = () => React.useContext(NavContext)!;

const NavItem = ({ id, icon: Icon, label, current, navigate }: { id: ScreenId, icon: any, label: string, current: string, navigate: (id: ScreenId) => void }) => {
  const active = current === id;
  return (
    <div 
      onClick={() => navigate(id)}
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-1.5 py-2 relative transition-all active:scale-90",
        active ? "opacity-100" : "opacity-40"
      )}
    >
      <div className="relative flex items-center justify-center">
        <Icon size={22} className={cn("transition-all", active ? "drop-shadow-[0_0_6px_var(--accent)] text-accent" : "")} />
      </div>
      <div className={cn("text-[9px] font-head font-semibold tracking-[1.5px] uppercase", active ? "text-accent" : "")}>{label}</div>
    </div>
  );
};

export function BottomNav() {
  const { current, navigate, openAdd } = useNav();

  const isNav = ['home', 'search', 'archive', 'settings'].includes(current);
  if (!isNav) return null;

  return (
    <nav className="flex items-stretch bg-bg/95 backdrop-blur-xl border-t border-border pb-[env(safe-area-inset-bottom,8px)] relative z-[100] shrink-0">
      <NavItem id="home" icon={Home} label="Home" current={current} navigate={navigate} />
      <NavItem id="search" icon={SearchIcon} label="Search" current={current} navigate={navigate} />
      
      <div onClick={() => openAdd()} className="flex-1 flex flex-col items-center justify-center pb-1 gap-1.5 group active:scale-90 transition-transform cursor-pointer">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-bg font-black text-2xl shadow-[0_0_20px_var(--tw-shadow-color),0_4px_12px_rgba(0,0,0,0.4)] shadow-accent/40 -mt-4 transition-all group-active:shadow-[0_0_30px_var(--tw-shadow-color)] group-active:shadow-accent/60">
          <Plus size={24} strokeWidth={3} />
        </div>
        <div className="text-[9px] font-head tracking-[1.5px] uppercase text-accent mt-0.5">Wish</div>
      </div>

      <NavItem id="archive" icon={Archive} label="Archive" current={current} navigate={navigate} />
      <NavItem id="settings" icon={SettingsIcon} label="Settings" current={current} navigate={navigate} />
    </nav>
  );
}

export function Toast({ message, visible }: { message: string, visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
           initial={{ opacity: 0, y: 20, x: '-50%' }}
           animate={{ opacity: 1, y: 0, x: '-50%' }}
           exit={{ opacity: 0, y: -12, x: '-50%' }}
           className="fixed bottom-[100px] left-1/2 bg-surface border border-accent/30 rounded-[30px] px-6 py-3 font-head text-sm font-semibold tracking-wide text-accent shadow-[0_0_30px_rgba(57,255,20,0.15),0_8px_32px_rgba(0,0,0,0.5)] z-[500] whitespace-nowrap"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
