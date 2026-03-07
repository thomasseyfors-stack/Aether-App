import React, { useState } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import AetherLogo from './AetherLogo';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID.apps.googleusercontent.com";

function AuthForm({ onLogin }: { onLogin: (authData: { type: string, email?: string }) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Auto-bypass useEffect REMOVED to enforce the Front Door policy

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ type: 'email', email });
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());
        
        localStorage.setItem('aether_google_auth', 'true');
        localStorage.setItem('aether_user_fname', userInfo.given_name || '');
        localStorage.setItem('aether_user_lname', userInfo.family_name || '');
        
        onLogin({ type: 'google', email: userInfo.email });
      } catch (err) {
        console.error(err);
        onLogin({ type: 'google' });
      }
    },
    prompt: 'select_account'
  });

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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-obsidian border border-ash-grey/20 rounded-lg px-4 py-3 text-starlight-white focus:outline-none focus:border-astral-gold focus:ring-1 focus:ring-astral-gold transition-colors" required />
          </div>
          <div>
            <label className="block text-ash-grey text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-obsidian border border-ash-grey/20 rounded-lg px-4 py-3 text-starlight-white focus:outline-none focus:border-astral-gold focus:ring-1 focus:ring-astral-gold transition-colors" required />
          </div>
          <button type="submit" className="w-full bg-nebula-purple hover:bg-nebula-purple/80 text-starlight-white font-bold py-3 px-4 rounded-lg uppercase tracking-widest transition-colors">Initialize Sequence</button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ash-grey/20"></div></div>
          <div className="relative flex justify-center text-xs"><span className="bg-obsidian px-4 text-ash-grey uppercase tracking-wider">Or bypass with</span></div>
        </div>

        <button type="button" onClick={() => handleGoogleSignIn()} className="mt-6 w-full bg-starlight-white text-obsidian font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-starlight-white/90 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="uppercase tracking-wider text-sm">Sign in with Google</span>
        </button>

        <button type="button" onClick={() => { localStorage.setItem('aether_guest', 'true'); onLogin({ type: 'guest' }); }} className="mt-4 w-full border border-ash-grey/20 text-ash-grey hover:text-starlight-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-ash-grey/10 transition-colors uppercase tracking-wider text-xs">
          Proceed as Guest / Anonymous
        </button>
      </div>
    </div>
  );
}

export default function AuthGateway({ onLogin }: { onLogin: (authData: { type: string, email?: string }) => void }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthForm onLogin={onLogin} />
    </GoogleOAuthProvider>
  );
}
