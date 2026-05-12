'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { StoreProvider, useStore } from './store';
import { NavContext, ScreenId, BottomNav, Toast } from './AppScreens';
import HomeScreen from './screens/HomeScreen';
import { AddWishScreen, DetailScreen, ArchiveScreen, SearchScreen, SettingsScreen } from './screens/OtherScreens';
import { SplashScreen } from './screens/SplashScreen';
import { AmbientOrbs } from './ui';

export function AppContent() {
  const { loaded } = useStore();
  const [current, setCurrent] = useState<ScreenId>('splash');
  const [history, setHistory] = useState<ScreenId[]>([]);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const navigate = (screen: ScreenId) => {
    if (screen === current) return;
    setHistory(prev => [...prev, current]);
    setCurrent(screen);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setCurrent(prev);
    } else {
      setCurrent('home');
    }
  };

  const openDetail = (id: string) => {
    setDetailId(id);
    navigate('detail');
  };

  const openAdd = (id?: string) => {
    setEditingId(id || null);
    navigate('add');
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  if (!loaded) return null;

  return (
    <NavContext.Provider value={{ current, navigate, goBack, openDetail, openAdd, detailId, editingId, showToast }}>
      <div className="flex flex-col h-[100dvh] w-full bg-bg relative overflow-hidden text-text font-body">
        <AmbientOrbs />
        
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: current === 'splash' ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {current === 'splash' && <SplashScreen />}
              {current === 'home' && <HomeScreen />}
              {current === 'search' && <SearchScreen />}
              {current === 'archive' && <ArchiveScreen />}
              {current === 'settings' && <SettingsScreen />}
              {current === 'add' && <AddWishScreen />}
              {current === 'detail' && <DetailScreen />}
            </motion.div>
          </AnimatePresence>
        </div>

        <BottomNav />
        <Toast message={toastMsg} visible={toastVisible} />
      </div>
    </NavContext.Provider>
  );
}

export function AppCore() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
  }
    
