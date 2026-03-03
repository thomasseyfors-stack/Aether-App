import React, { useState } from 'react';
import AuthGateway from './components/AuthGateway';
import ProfileIntake from './components/ProfileIntake';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-obsidian text-starlight-white font-sans">
      {!isAuthenticated ? (
        <AuthGateway onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <ProfileIntake />
      )}
    </div>
  );
}
