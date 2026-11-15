/**
 * Dynamic loader for the 3D game canvas.
 * Uses next/dynamic with SSR disabled as required by AGENTS.md.
 * Wrapped in an Error Boundary for WebGL fallback detection.
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AlertTriangle } from 'lucide-react';

const GameCanvasInner = dynamic(() => import('./GameCanvasInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-space-950">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 border-2 border-cyan-500/50 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-cyan-400 font-mono text-sm tracking-widest">
          INITIALIZING STATION SYSTEMS...
        </p>
      </div>
    </div>
  ),
});

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('WebGL Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-space-950 p-8">
          <div className="max-w-md text-center glass-panel p-8 rounded-2xl border border-red-500/40">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-mono font-bold text-red-400 mb-2">
              GRAPHICS SUBSYSTEM FAILURE
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              WebGL is not available or encountered an error. The 3D station view
              requires a WebGL-capable browser.
            </p>
            <p className="text-xs text-slate-500 font-mono">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-mono text-xs"
            >
              RETRY
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function GameCanvas() {
  return (
    <WebGLErrorBoundary>
      <GameCanvasInner />
    </WebGLErrorBoundary>
  );
}
