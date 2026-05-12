import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search as SearchIcon, ChevronDown, Sparkles, Navigation2, Heart, Activity, Map as MapIcon, MoreHorizontal, PenLine, Lock, Star, Bell, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store';
import { useNav } from '../AppScreens';
import { Category, Wish, SortOrder } from '../../lib/types';
import { cn, TopBar } from '../ui';

const catIcons: Record<Category, React.ElementType> = {
  personal: Sparkles,
  career: Navigation2,
  love: Heart,
  health: Activity,
  adventure: MapIcon,
  other: MoreHorizontal
};

export function WishCard({ wish, index, onClick }: { wish: Wish, index: number, onClick: () => void }) {
  const { settings } = useStore();
  const compact = settings.compactMode;
  const Icon = catIcons[wish.category] || MoreHorizontal;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ delay: Math.min(index * 0.02, 0.1), duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "bg-surface border border-border2 relative overflow-hidden transition-all active:scale-[0.985] active:bg-surface2 cursor-pointer",
        compact ? "p-3 mb-2 rounded-xl" : "p-4 mb-3 rounded-2xl",
        wish.fulfilled ? "opacity-60 grayscale-[0.5]" : ""
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      {wish.important && !wish.fulfilled && <div className={cn("absolute top-0 right-0 w-[3px] bottom-0 bg-gradient-to-b from-warning to-transparent", compact ? "rounded-r-xl" : "rounded-r-2xl")} />}
      {wish.fulfilled && <div className={cn("absolute top-0 right-0 w-[3px] bottom-0 bg-gradient-to-b from-emerald-500 to-transparent", compact ? "rounded-r-xl" : "rounded-r-2xl")} />}

      <div className={cn("flex", compact ? "items-center gap-2.5" : "items-start gap-3")}>
        <div className={cn("shrink-0 opacity-80", wish.fulfilled && "text-emerald-500", compact ? "mt-0" : "mt-0.5")}><Icon size={compact ? 16 : 20} /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className={cn("font-head font-bold leading-tight truncate", compact ? "text-[15px]" : "text-[18px] mb-1", wish.fulfilled ? "line-through text-text-sub" : "text-text")}>{wish.title}</div>
            
            {compact && (
              <div className="flex items-center gap-1.5 shrink-0">
                {wish.fulfilled && <CheckCircle2 size={12} className="text-emerald-500" />}
                {wish.important && !wish.fulfilled && <Star size={12} className="text-warning" fill="currentColor" />}
                {wish.reminder && !wish.fulfilled && <Bell size={12} className="text-info" />}
              </div>
            )}
          </div>
          
          {!compact && wish.content && <div className="text-[13px] text-text-sub leading-snug line-clamp-2 mb-2.5">{wish.content}</div>}
          
          {!compact && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {wish.fulfilled && <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase font-head bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"><CheckCircle2 size={10} /> FULFILLED</span>}
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase font-head bg-white/5 text-text-sub"><Lock size={10} /> PRIVATE</span>
              {wish.important && !wish.fulfilled && <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase font-head bg-warning/10 border border-warning/20 text-warning"><Star size={10} fill="currentColor" /> IMPORTANT</span>}
              {wish.reminder && !wish.fulfilled && <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase font-head bg-info/10 border border-info/20 text-info"><Bell size={10} /> REMINDER</span>}
            </div>
          )}
          
          {!compact && (
            <div className="flex items-center justify-between mt-1">
              <div className="text-[11px] text-text-faint font-head tracking-wide">
                {new Date(wish.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
              </div>
              {wish.reminder && !wish.fulfilled && <div className="text-[11px] text-info flex items-center gap-1"><Bell size={10} /> {new Date(wish.reminder).toLocaleDateString()}</div>}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function HomeScreen() {
  const { wishes, settings, updateSettings } = useStore();
  const { navigate, openAdd, openDetail } = useNav();
  const [catFilter, setCatFilter] = useState<Category | 'all'>('all');

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'GOOD MORNING' : h < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';
  };

  const allActive = wishes.filter(w => !w.archived);
  const total = allActive.length;
  const important = allActive.filter(w => w.important).length;
  const archived = wishes.filter(w => w.archived).length;

  let filtered = allActive;
  if (catFilter !== 'all') filtered = filtered.filter(w => w.category === catFilter);
  
  filtered = [...filtered].sort((a, b) => {
    if (settings.sortOrder === 'important') {
      if (a.important !== b.important) return a.important ? -1 : 1;
    }
    if (settings.sortOrder === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const toggleSort = () => {
    const orders: SortOrder[] = ['newest','oldest','important'];
    const i = orders.indexOf(settings.sortOrder);
    updateSettings({ sortOrder: orders[(i+1) % orders.length] });
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-transparent">
      <TopBar 
        title="KIRIJO" 
        rightAction={
          <button onClick={() => navigate('search')} className="w-9 h-9 rounded-xl border border-border bg-transparent text-text-sub flex items-center justify-center transition-all active:bg-surface2 active:text-text">
            <SearchIcon size={16} />
          </button>
        } 
      />
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="px-4 pt-5 pb-0 relative z-10">
          <div className="font-head text-[13px] tracking-[2px] uppercase text-text-faint">{greeting()}</div>
          <div className="font-disp text-[28px] font-bold text-text leading-[1.1] mt-1">What do you<br/>wish for today?</div>

          <div className="flex gap-2.5 mt-4 mb-6">
            <div className="flex-1 bg-surface border border-border rounded-2xl p-3.5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              <div className="font-disp text-[22px] font-bold text-accent">{total}</div>
              <div className="text-[10px] text-text-faint font-head tracking-wider uppercase mt-0.5">TOTAL WISHES</div>
            </div>
            <div className="flex-1 bg-surface border border-border rounded-2xl p-3.5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              <div className="font-disp text-[22px] font-bold text-text">{important}</div>
              <div className="text-[10px] text-text-faint font-head tracking-wider uppercase mt-0.5">IMPORTANT</div>
            </div>
            <div className="flex-1 bg-surface border border-border rounded-2xl p-3.5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              <div className="font-disp text-[22px] font-bold text-text">{archived}</div>
              <div className="text-[10px] text-text-faint font-head tracking-wider uppercase mt-0.5">ARCHIVED</div>
            </div>
          </div>

          <div 
            onClick={() => openAdd()}
            className="bg-surface border border-border2 rounded-3xl p-4.5 mb-6 cursor-pointer hover:bg-surface2 transition-all active:scale-[0.985] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,color-mix(in_srgb,var(--color-accent)_4%,transparent)_0%,transparent_60%)]" />
            <div className="text-[14px] text-text-faint mb-3.5 italic flex items-center gap-2">
              <Sparkles size={14} className="text-accent/50" /> Whisper your wish into the void...
            </div>
            <div className="h-11 bg-surface2 border border-border lg:border-border2 rounded-xl flex items-center px-3.5 text-text-faint text-[14px] gap-2.5">
              <div className="w-[2px] h-4 bg-accent animate-[blink_1.1s_step-end_infinite]" />
              Write a new wish...
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-head text-[11px] font-bold tracking-[2px] uppercase text-text-sub">RECENT WISHES</div>
            <button onClick={toggleSort} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border2 bg-surface text-text-sub font-head text-[12px] tracking-wider uppercase transition-colors active:bg-surface2">
              <ChevronDown size={12} />
              <span>{settings.sortOrder}</span>
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 pb-2 mb-3">
            {(['all','personal','career','love','health','adventure','other'] as const).map(c => {
              const active = catFilter === c;
              return (
                <button 
                  key={c}
                  onClick={() => setCatFilter(c)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium border whitespace-nowrap transition-all active:scale-95",
                    active ? "bg-accent-dim border-accent/40 text-accent" : "border-border2 bg-surface text-text-sub hover:bg-surface2"
                  )}
                >
                  {c.toUpperCase()}
                </button>
              );
            })}
          </div>

          <div className="pb-10">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
                <Sparkles className="w-12 h-12 opacity-20 mb-1" />
                <div className="font-head text-[20px] font-bold text-text-sub">{catFilter !== 'all' ? 'No wishes in this category' : 'No wishes yet'}</div>
                <div className="text-[13px] text-text-faint leading-relaxed">{catFilter !== 'all' ? 'Try a different filter or write your first wish.' : 'Tap ＋ to write your first wish.\nLet the universe hear you.'}</div>
              </div>
            ) : (
              <AnimatePresence>
                {filtered.map((w, i) => (
                  <WishCard key={w.id} wish={w} index={i} onClick={() => openDetail(w.id)} />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
