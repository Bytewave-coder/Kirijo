import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, ArrowLeft, Archive, Trash2, ArrowRightCircle, Sparkles, Navigation2, Heart, Activity, Map as MapIcon, MoreHorizontal, Download, Upload, Info, AlertTriangle, PenLine, Star, Lock, CornerDownLeft, RotateCcw } from 'lucide-react';
import { useStore } from '../store';
import { useNav } from '../AppScreens';
import { Wish, Category } from '../../lib/types';
import { cn, TopBar } from '../ui';
import { WishCard } from './HomeScreen';

const catIcons: Record<Category, React.ElementType> = {
  personal: Sparkles,
  career: Navigation2,
  love: Heart,
  health: Activity,
  adventure: MapIcon,
  other: MoreHorizontal
};

export function AddWishScreen() {
  const { wishes, addWish, updateWish } = useStore();
  const { goBack, editingId, showToast } = useNav();

  const existing = editingId ? wishes.find(w => w.id === editingId) : null;

  const [title, setTitle] = useState(existing?.title || '');
  const [content, setContent] = useState(existing?.content || '');
  const [cat, setCat] = useState<Category>(existing?.category || 'personal');
  const [important, setImportant] = useState(existing?.important || false);
  const [reminder, setReminder] = useState<string | null>(existing?.reminder || null);

  const handleSave = () => {
    if (!title.trim()) return; // Shake logic could be added
    
    if (existing) {
      updateWish(existing.id, { title, content, category: cat, important, reminder });
      showToast('✦ Wish updated');
    } else {
      addWish({ title, content, category: cat, important, reminder, archived: false });
      showToast('✦ Wish saved');
    }
    goBack();
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-bg z-20">
      <TopBar 
        title={existing ? "Edit Wish" : "New Wish"} 
        onBack={goBack}
        rightAction={
          <button onClick={() => setImportant(!important)} className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all", important ? "text-warning drop-shadow-[0_0_10px_rgba(255,204,0,0.6)]" : "text-text-sub hover:text-text")}>
            <Star size={18} fill={important ? "currentColor" : "none"} />
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-5 pb-24">
        
        <div className="mb-4">
          <div className="font-head text-[11px] font-bold tracking-[2px] uppercase text-text-sub mb-2">WISH TITLE</div>
          <input 
            value={title} onChange={e => setTitle(e.target.value)}
            className="w-full bg-surface border border-border2 rounded-2xl text-text p-4 text-[15px] outline-none transition-all focus:border-accent/50 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_8%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent)_10%,transparent)] placeholder:text-text-faint"
            placeholder="Name your wish..." maxLength={80} autoFocus
          />
        </div>

        <div className="mb-4">
          <div className="font-head text-[11px] font-bold tracking-[2px] uppercase text-text-sub mb-2">WISH DETAILS</div>
          <textarea 
            value={content} onChange={e => setContent(e.target.value)}
            className="w-full bg-surface border border-border2 rounded-2xl text-text p-4 text-[15px] outline-none transition-all focus:border-accent/50 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_8%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent)_10%,transparent)] placeholder:text-text-faint min-h-[130px] resize-none leading-relaxed"
            placeholder="Describe your wish in detail... What does it mean to you? Why do you want it?" maxLength={2000}
          />
          <div className={cn("text-right text-[11px] font-head mt-1", content.length > 1800 ? "text-warning" : "text-text-faint")}>
            {content.length} / 2000
          </div>
        </div>

        <div className="mb-4">
          <div className="font-head text-[11px] font-bold tracking-[2px] uppercase text-text-sub mb-2">CATEGORY</div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 mb-1">
            {(['personal','career','love','health','adventure','other'] as const).map(c => {
              const active = cat === c;
              return (
                <button 
                  key={c} onClick={() => setCat(c)}
                  className={cn(
                    "shrink-0 inline-flex items-center px-4 py-2 rounded-full text-[13px] font-medium border whitespace-nowrap transition-all active:scale-95",
                    active ? "bg-accent-dim border-accent/40 text-accent" : "border-border2 bg-surface text-text-sub"
                  )}
                >
                  {c.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-7 bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[15px] font-medium text-text">Mark as Important</div>
            <div className="text-[12px] text-text-sub mt-0.5">Highlighted in your wish list</div>
          </div>
          <label className="relative flex items-center cursor-pointer w-[52px] h-[30px] shrink-0">
            <input type="checkbox" className="sr-only" checked={important} onChange={e => setImportant(e.target.checked)} />
            <div className={cn("absolute inset-0 rounded-full border transition-all", important ? "bg-accent-dim border-accent/50" : "bg-surface2 border-border2")} />
            <div className={cn("absolute left-1 top-1 w-5 h-5 rounded-full transition-all", important ? "bg-accent shadow-[0_0_10px_var(--tw-shadow-color)] shadow-accent/60 translate-x-[22px]" : "bg-text-faint")} />
          </label>
        </div>

        <button onClick={handleSave} className="w-full relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl p-4 font-head text-[18px] font-bold tracking-widest bg-accent text-bg shadow-[0_0_30px_var(--tw-shadow-color),0_4px_16px_rgba(0,0,0,0.3)] shadow-accent/25 transition-all active:scale-95 active:shadow-[0_0_40px_var(--tw-shadow-color),0_4px_16px_rgba(0,0,0,0.3)] active:shadow-accent/50">
          <ArrowRightCircle size={20} />
          SAVE WISH
        </button>

      </div>
    </div>
  );
}

export function DetailScreen() {
  const { wishes, updateWish, deleteWish } = useStore();
  const { goBack, detailId, openAdd, showToast } = useNav();
  
  const w = wishes.find(w => w.id === detailId);
  if (!w) return null;

  const Icon = catIcons[w.category];

  return (
    <div className="absolute inset-0 flex flex-col bg-bg z-20">
      <TopBar 
        title="Wish Detail" 
        onBack={goBack} 
        rightAction={
          <button onClick={() => openAdd(w.id)} className="w-9 h-9 rounded-xl flex items-center justify-center text-text-sub hover:text-text active:bg-surface2 transition-all">
            <PenLine size={18} />
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-5 pb-24">
        
        <div className="flex items-center gap-3 mb-4">
          <Icon size={36} className="text-text" />
          <div className="flex-1">
            <div className="font-head text-[11px] font-bold tracking-[1.5px] uppercase text-text-faint mb-1">{w.category}</div>
            <div className="font-head text-[28px] font-bold leading-tight">{w.title}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className="inline-flex flex-row items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-head bg-[#50505033] text-[#999]"><Lock size={12} /> PRIVATE</span>
          {w.important && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-head bg-warning/10 border border-warning/25 text-warning"><Star fill="currentColor" size={12} /> IMPORTANT</span>}
          {w.archived ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-head bg-accent/5 text-[#50853a]"><Archive size={12} /> ARCHIVED</span> : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-head bg-accent/10 text-accent"><Activity size={12} /> ACTIVE</span>}
        </div>

        <div className="font-head text-[12px] tracking-wide text-text-faint mb-4">
          Created {new Date(w.createdAt).toLocaleString()} 
          {w.updatedAt !== w.createdAt && ` · Edited ${new Date(w.updatedAt).toLocaleDateString()}`}
        </div>

        {w.content ? (
          <div className="bg-surface border border-border rounded-2xl p-5 mb-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            <div className="text-[16px] leading-[1.75] text-text-sub whitespace-pre-wrap break-words">{w.content}</div>
          </div>
        ) : (
          <div className="text-text-faint text-[14px] italic py-3">No details written.</div>
        )}

        <div className="flex gap-3 mt-8 flex-col">
          <button 
            onClick={() => {
              updateWish(w.id, { fulfilled: !w.fulfilled });
              showToast(w.fulfilled ? '✦ Wish unmarked' : '✨ Wish fulfilled!');
            }}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-2xl p-4 font-head text-[16px] font-bold tracking-widest transition-all active:scale-95",
              w.fulfilled ? "border border-border2 text-text-sub bg-surface" : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20"
            )}
          >
            {w.fulfilled ? <><RotateCcw size={18} /> UNMARK FULFILLED</> : <><Sparkles size={18} /> MARK AS FULFILLED</>}
          </button>
          
          <div className="flex flex-row gap-3">
            <button 
              onClick={() => {
                updateWish(w.id, { archived: !w.archived });
                showToast(w.archived ? '↩ Wish restored' : '▣ Wish archived');
              }}
              className={cn(
                "flex-1 flex justify-center items-center gap-2 rounded-2xl py-3 font-head font-bold tracking-wider text-[14px] transition-all active:scale-95",
                w.archived ? "bg-accent/10 border border-accent/30 text-accent" : "border border-border2 text-text-sub bg-surface hover:bg-surface2"
              )}
            >
              {w.archived ? <><RotateCcw size={16} /> RESTORE</> : <><Archive size={16} /> ARCHIVE</>}
            </button>
            
            <button 
              onClick={() => {
                deleteWish(w.id);
                showToast('✦ Wish deleted');
                goBack();
              }}
              className="flex-1 flex justify-center items-center gap-2 rounded-2xl py-3 font-head font-bold tracking-wider text-[14px] bg-danger/10 border border-danger/30 text-danger transition-all active:scale-95"
            >
              <Trash2 size={16} /> DELETE
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export function SettingsScreen() {
  const { wishes, settings, updateSettings, importWishes, clearWishes } = useStore();
  const { navigate, showToast } = useNav();

  const handleExport = () => {
    const data = { appName: 'KIRIJO Wish Journal', exportDate: new Date().toISOString(), version: '1.0.0', wishes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kirijo-wishes-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✦ Wishes exported');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        const wList = data.wishes || (Array.isArray(data) ? data : null);
        if (!Array.isArray(wList)) throw new Error();
        importWishes(wList);
        showToast(`✦ Imported ${wList.length} wishes`);
      } catch {
        showToast('! Invalid file format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const themes = ['light', 'dark', 'midnight', 'forest', 'blossom'] as const;
  const fonts = ['default', 'serif', 'mono'] as const;

  return (
    <div className="absolute inset-0 flex flex-col bg-bg">
      <TopBar title="Settings" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-1 pb-24">
        
        <div className="flex items-center gap-3 py-5 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-accent-dim border border-accent/25 flex items-center justify-center text-[22px] text-accent">✦</div>
          <div>
            <div className="font-disp font-bold text-[22px] gradient-text tracking-wide">KIRIJO</div>
            <div className="font-head text-[11px] tracking-wide text-text-faint mt-0.5">WISH JOURNAL · v1.0.0</div>
          </div>
        </div>

        <div className="font-head text-[11px] font-bold tracking-[2px] text-text-sub uppercase mb-2.5">Appearance</div>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-5">
          <div className="p-4 border-b border-border">
            <div className="text-[15px] font-medium text-text">Theme</div>
            <div className="text-[12px] text-text-sub mt-1 mb-3">Choose your color mode</div>
            <div className="flex flex-wrap gap-2">
              {themes.map(t => (
                <button key={t} onClick={() => updateSettings({ theme: t })} className={cn("px-4 py-2 rounded-xl text-[13px] border transition-all capitalize", settings.theme === t ? "bg-accent-dim border-accent/40 text-accent font-medium" : "bg-surface2 border-border2 text-text-sub")}>{t}</button>
              ))}
            </div>
          </div>
          <div className="p-4 border-b border-border">
            <div className="text-[15px] font-medium text-text">Layout Density</div>
            <div className="text-[12px] text-text-sub mt-1 mb-3">Choose list spacing</div>
            <div className="flex gap-2">
              <button onClick={() => updateSettings({ compactMode: false })} className={cn("flex-1 py-2 rounded-xl text-[13px] border transition-all", !settings.compactMode ? "bg-accent-dim border-accent/40 text-accent font-medium" : "bg-surface2 border-border2 text-text-sub")}>Airy</button>
              <button onClick={() => updateSettings({ compactMode: true })} className={cn("flex-1 py-2 rounded-xl text-[13px] border transition-all", settings.compactMode ? "bg-accent-dim border-accent/40 text-accent font-medium" : "bg-surface2 border-border2 text-text-sub")}>Compact</button>
            </div>
          </div>
          <div className="p-4">
            <div className="text-[15px] font-medium text-text">Font Style</div>
            <div className="text-[12px] text-text-sub mt-1 mb-3">Choose your reading preference</div>
            <div className="flex gap-2">
              {fonts.map(f => (
                <button key={f} onClick={() => updateSettings({ fontStyle: f })} className={cn("flex-1 py-2 rounded-xl text-[13px] border transition-all capitalize", settings.fontStyle === f ? "bg-accent-dim border-accent/40 text-accent" : "bg-surface2 border-border2 text-text-sub", f === 'serif' ? 'font-serif' : f === 'mono' ? "font-mono" : "font-body")}>{f}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="font-head text-[11px] font-bold tracking-[2px] text-text-sub uppercase mb-2.5">Data</div>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-5">
          <div onClick={handleExport} className="p-4 border-b border-border flex items-center justify-between cursor-pointer hover:bg-surface2 transition-all">
            <div>
              <div className="text-[15px] font-medium text-text">Export Wishes</div>
              <div className="text-[12px] text-text-sub mt-0.5">Download as JSON file</div>
            </div>
            <Download size={18} className="text-text-sub" />
          </div>
          <label className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface2 transition-all">
            <div>
              <div className="text-[15px] font-medium text-text">Import Wishes</div>
              <div className="text-[12px] text-text-sub mt-0.5">Restore from JSON file</div>
            </div>
            <Upload size={18} className="text-text-sub" />
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>

        <div className="font-head text-[11px] font-bold tracking-[2px] text-text-sub uppercase mb-2.5">Danger Zone</div>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-5">
          <div onClick={() => { if(confirm('Reset all data? This cannot be undone.')) clearWishes(); }} className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface2 transition-all">
            <div>
              <div className="text-[15px] font-medium text-danger">Reset All Data</div>
              <div className="text-[12px] text-text-sub mt-0.5">Permanently delete all wishes</div>
            </div>
            <AlertTriangle size={18} className="text-danger" />
          </div>
        </div>

        <div className="text-center py-6">
          <div className="font-head text-[11px] font-bold tracking-[2px] text-text-faint">KIRIJO · WISH JOURNAL</div>
          <div className="font-head text-[10px] tracking-widest text-[#505050] mt-1">MADE WITH ✦ AND STARDUST</div>
        </div>

      </div>
    </div>
  );
}

export function ArchiveScreen() {
  const { wishes } = useStore();
  const { openDetail } = useNav();
  
  const archived = [...wishes].filter(w => w.archived).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="absolute inset-0 flex flex-col bg-bg">
      <TopBar title="Archive" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-24">
        <div className="font-head text-[11px] font-bold tracking-[2px] uppercase text-text-sub mb-4 flex items-center gap-2">
          ARCHIVED WISHES
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-accent/5 text-[#50853a]">{archived.length}</span>
        </div>
        
        {archived.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
             <Archive size={48} strokeWidth={1} className="opacity-20 mb-2" />
             <div className="font-head text-[20px] font-bold text-text-sub">Archive is empty</div>
             <div className="text-[13px] text-text-faint leading-relaxed">Archived wishes will appear here.</div>
          </div>
        ) : (
          <AnimatePresence>
            {archived.map((w, i) => (
               <WishCard key={w.id} wish={w} index={i} onClick={() => openDetail(w.id)} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export function SearchScreen() {
  const { wishes, settings } = useStore();
  const { openDetail } = useNav();
  
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [incArchived, setIncArchived] = useState(false);

  let results = wishes;
  if (!incArchived) results = results.filter(w => !w.archived);
  if (cat !== 'all') results = results.filter(w => w.category === cat);
  if (q) {
    const lq = q.toLowerCase();
    results = results.filter(w => w.title.toLowerCase().includes(lq) || w.content.toLowerCase().includes(lq));
  }
  
  results = [...results].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="absolute inset-0 flex flex-col bg-bg">
      <TopBar title="Search" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-24">
        
        <div className="relative mb-3.5">
          <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint" />
          <input 
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search wishes..."
            className="w-full bg-surface border border-border2 rounded-2xl py-3.5 pl-11 pr-4 text-[15px] text-text outline-none focus:border-accent/50 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_8%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent)_10%,transparent)] transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 mb-3.5">
          {(['all','personal','career','love','health','adventure','other'] as const).map(c => {
            const active = cat === c;
            return (
              <button 
                key={c} onClick={() => setCat(c)}
                className={cn(
                  "shrink-0 inline-flex items-center px-3.5 py-2 rounded-full text-[13px] font-medium border whitespace-nowrap transition-all",
                  active ? "bg-accent-dim border-accent/40 text-accent" : "border-border2 bg-surface text-text-sub"
                )}
              >
                {c.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between font-head text-[13px] text-text-sub mb-4 px-1">
          <span>Include archived wishes</span>
          <label className="relative flex items-center cursor-pointer w-[44px] h-[24px]">
            <input type="checkbox" className="sr-only" checked={incArchived} onChange={e => setIncArchived(e.target.checked)} />
            <div className={cn("absolute inset-0 rounded-full border transition-all", incArchived ? "bg-accent-dim border-accent/50" : "bg-surface2 border-border2")} />
            <div className={cn("absolute left-1 top-1 w-4 h-4 rounded-full transition-all", incArchived ? "bg-accent shadow-[0_0_10px_var(--tw-shadow-color)] shadow-accent/60 translate-x-[18px]" : "bg-text-faint")} />
          </label>
        </div>

        <div>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon size={40} className="opacity-20 mx-auto mb-3" />
              <div className="font-head text-[18px] font-bold text-text-sub">{q ? `No results for "${q}"` : 'Start typing to search'}</div>
            </div>
          ) : (
            <AnimatePresence>
              {results.map((w, i) => (
                <WishCard key={w.id} wish={w} index={i} onClick={() => openDetail(w.id)} />
              ))}
            </AnimatePresence>
          )}
        </div>

      </div>
    </div>
  );
}
