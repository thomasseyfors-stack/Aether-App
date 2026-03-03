import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { clearAetherCache } from '../utils/cacheManager';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error intercepted by Aether Blast Shield:', error, errorInfo);
    this.setState({ errorInfo });
    clearAetherCache(); // Crash-Triggered Purge
  }

  private handlePurgeAndRestart = () => {
    clearAetherCache();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-4 text-center font-sans">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold text-starlight-white tracking-widest uppercase mb-2">Structural Collapse</h2>
          <p className="text-red-400 text-xs tracking-widest uppercase mb-6">Critical Rendering Failure Intercepted</p>
          
          <div className="bg-black/50 border border-red-500/30 rounded-lg p-4 max-w-2xl w-full mb-8 overflow-auto text-left">
            <p className="text-starlight-white font-mono text-sm mb-2">{this.state.error?.toString()}</p>
            <pre className="text-ash-grey font-mono text-[10px] whitespace-pre-wrap">
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>

          <button
            onClick={this.handlePurgeAndRestart}
            className="flex items-center gap-2 bg-red-900/50 hover:bg-red-900/80 text-starlight-white border border-red-500/50 font-bold py-3 px-6 rounded-lg uppercase tracking-widest transition-colors"
          >
            <RefreshCcw className="w-5 h-5" />
            Purge Memory & Restart
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
