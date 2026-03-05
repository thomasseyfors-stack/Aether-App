import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import AetherLogo from './AetherLogo';

export default function AuthGateway({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const hasGoogleAuth = localStorage.getItem('aether_google_auth');
    const isGuest = localStorage.getItem('aether_guest');
    if (hasGoogleAuth === 'true' || isGuest === 'true') {
      onLogin();
      return;
    }
    const savedEmail = localStorage.getItem('aether_saved_email');
    if (savedEmail) setEmail(savedEmail);
  }, [onLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('aether_saved_email', email);
      onLogin();
    }
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log("Secure Tunnel Established. Initializing Sovereign Vault Key Protocol.");
      
      localStorage.setItem('aether_sovereign_id', decoded.sub);
      if (decoded.given_name) localStorage.setItem('aether_first_name', decoded.given_name);
      if (decoded.family_name) localStorage.setItem('aether_last_name', decoded.family_name);
      if (decoded.email) localStorage.setItem('aether_saved_email', decoded.email);
      
      localStorage.setItem('aether_google_auth', 'true');
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-obsidian border border-nebula-purple/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(106,13,173,0.15)]">
        <div className="text-center mb-8 flex flex-col items-center">
          <AetherLogo className="w-24 h-24 mb-4" />
          <h1 className="text-3xl font-bold text-starlight-white tracking-widest uppercase mb-2">Aether</h1>
          <p className="text-ash-grey text-sm tracking-widest uppercase">Energetic Navigation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-ash-grey text-xs font-semibold uppercase tracking-wider mb-2">Email</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-obsidian border border-ash-grey/20 rounded-lg px-4 py-3 text-starlight-white focus:outline-none focus:border-astral-gold focus:ring-1 focus:ring-astral-gold transition-colors" required
            />
          </div>
          <div>
            <label className="block text-ash-grey text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-obsidian border border-ash-grey/20 rounded-lg px-4 py-3 text-starlight-white focus:outline-none focus:border-astral-gold focus:ring-1 focus:ring-astral-gold transition-colors" required
            />
          </div>
          <button type="submit" className="w-full bg-nebula-purple hover:bg-nebula-purple/80 text-starlight-white font-bold py-3 px-4 rounded-lg uppercase tracking-widest transition-colors">
            Initialize Sequence
          </button>
        </form>

        <div className="mt-8 relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-ash-grey/20"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-obsidian px-4 text-ash-grey uppercase tracking-wider">Or bypass with</span>
          </div>
        </div>

        <div className="flex justify-center w-full mt-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error('Cryptographic handshake failed.')}
            theme="filled_black" shape="rectangular" text="signin_with" size="large"
          />
        </div>

        <button 
          type="button"
          onClick={() => {
            localStorage.setItem('aether_guest', 'true');
            onLogin();
          }}
          className="mt-6 w-full border border-ash-grey/20 text-ash-grey hover:text-starlight-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-ash-grey/10 transition-colors uppercase tracking-wider text-xs"
        >
          Proceed as Guest / Anonymous
        </button>
      </div>
    </div>
  );
}
