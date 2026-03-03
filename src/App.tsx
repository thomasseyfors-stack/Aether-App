import React, { useState } from 'react';
import AuthGateway from './components/AuthGateway';
import ProfileIntake from './components/ProfileIntake';
import TransitionMatrix from './components/TransitionMatrix';
import Dashboard from './components/Dashboard';

type AppState = 'auth' | 'intake' | 'transition' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [payload, setPayload] = useState<any>(null);

  const handleLogin = () => setAppState('intake');
  
  const handleIntakeSubmit = (data: any) => {
    setPayload(data);
    setAppState('transition');
  };

  const handleTransitionSuccess = () => setAppState('dashboard');
  const handleTransitionCancel = () => setAppState('intake');

  return (
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
      {appState === 'dashboard' && <Dashboard payload={payload} />}
    </div>
  );
}
