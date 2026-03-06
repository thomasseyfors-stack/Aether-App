import React, { useState, useEffect } from 'react';
import AuthGateway from './components/AuthGateway';
import ProfileIntake from './components/ProfileIntake';
import TransitionMatrix from './components/TransitionMatrix';
import Dashboard from './components/Dashboard';
import TheoreticalAxiom from './components/TheoreticalAxiom';
import GlobalGrid from './components/GlobalGrid';
import ErrorBoundary from './components/ErrorBoundary';
import { checkCacheTTL, clearAetherCache, saveToCache, getFromCache } from './utils/cacheManager';

type AppState = 'auth' | 'intake' | 'transition' | 'dashboard' | 'axiom' | 'global';

export default function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    if (checkCacheTTL()) {
      const cachedPayload = getFromCache();
      if (cachedPayload) {
        setPayload(cachedPayload);
        setAppState('dashboard');
      }
    }
  }, []);

  useEffect(() => {
    const handleGlobalGridNav = () => setAppState('global');
    window.addEventListener('navigateGlobalGrid', handleGlobalGridNav);
    return () => window.removeEventListener('navigateGlobalGrid', handleGlobalGridNav as EventListener);
  }, []);

  const handleLogin = () => setAppState('intake');
  
  const handleIntakeSubmit = (data: any) => {
    setPayload(data);
    setAppState('transition');
  };

  const handleTransitionSuccess = (fullData: any) => {
    setPayload(fullData);
    saveToCache(fullData);
    setAppState('dashboard');
  };

  const handleTransitionCancel = () => setAppState('intake');

  const handleRecalibrate = () => {
    clearAetherCache();
    setPayload(null);
    setAppState('auth');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-obsidian text-starlight-white font-sans">
        {appState === 'auth' && <AuthGateway onLogin={handleLogin} />}
        {appState === 'intake' && <ProfileIntake onSubmit={handleIntakeSubmit} />}
        {appState === 'transition' && (
          <TransitionMatrix 
            payload={payload} 
            onSuccess={handleTransitionSuccess} 
            onCancel={handleTransitionCancel} 
          />
        )}
        {appState === 'dashboard' && (
          <Dashboard 
            payload={payload} 
            onEnterAxiom={() => setAppState('axiom')} 
            onRecalibrate={handleRecalibrate}
          />
        )}
        {appState === 'axiom' && (
          <ErrorBoundary>
            <TheoreticalAxiom 
              payload={payload} 
              onBack={() => setAppState('dashboard')} 
            />
          </ErrorBoundary>
        )}
        {appState === 'global' && payload && (
          <GlobalGrid 
            payload={payload} 
            onBack={() => setAppState('dashboard')} 
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
