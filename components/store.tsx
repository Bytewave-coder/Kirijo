'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Wish, AppSettings, ThemeName, FontStyle, SortOrder, Category } from '../lib/types';

interface StoreState {
  wishes: Wish[];
  settings: AppSettings;
  addWish: (w: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWish: (id: string, updates: Partial<Wish>) => void;
  deleteWish: (id: string) => void;
  clearWishes: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  importWishes: (wishes: Wish[]) => void;
  loaded: boolean;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  fontStyle: 'default',
  sortOrder: 'newest'
};

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
  const loadData = async () => {
    let w = [];
    let s = { ...defaultSettings };

    try {
      const savedWishes = localStorage.getItem('kirijo_wishes');

      if (savedWishes) {
        w = JSON.parse(savedWishes);
      }

      const savedSettings = localStorage.getItem('kirijo_settings');

      if (savedSettings) {
        s = {
          ...defaultSettings,
          ...JSON.parse(savedSettings),
        };
      }
    } catch (e) {
      console.error(e);
    }

    setWishes(w);
    setSettings(s);
    setLoaded(true);
  };

  loadData();
}, []);
  
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('kirijo_wishes', JSON.stringify(wishes));
    }
  }, [wishes, loaded]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('kirijo_settings', JSON.stringify(settings));
      // Update HTML dataset for theme
      document.documentElement.setAttribute('data-theme', settings.theme);
      // Update body font based on settings
      document.body.style.fontFamily = settings.fontStyle === 'mono' 
        ? "'Courier New', monospace"
        : settings.fontStyle === 'serif'
        ? "var(--font-serif)"
        : "var(--font-body)";
    }
  }, [settings, loaded]);

  const addWish = (w: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newWish: Wish = {
      ...w,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      createdAt: now,
      updatedAt: now
    };
    setWishes(prev => [newWish, ...prev]);
  };

  const updateWish = (id: string, updates: Partial<Wish>) => {
    setWishes(prev => prev.map(w => w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w));
  };

  const deleteWish = (id: string) => {
    setWishes(prev => prev.filter(w => w.id !== id));
  };

  const clearWishes = () => {
    setWishes([]);
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const importWishes = (newWishes: Wish[]) => {
    // Merge to avoid extreme duplicates, or just prepend without existing ids
    const existingIds = new Set(wishes.map(w => w.id));
    const toAdd = newWishes.filter(w => !existingIds.has(w.id));
    setWishes(prev => [...prev, ...toAdd]);
  };

  return (
    <StoreContext.Provider value={{ wishes, settings, loaded, addWish, updateWish, deleteWish, clearWishes, importWishes, updateSettings }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
};
