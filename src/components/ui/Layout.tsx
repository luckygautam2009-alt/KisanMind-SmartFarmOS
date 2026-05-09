import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AIAssistant } from './AIAssistant';
import { DashboardFooter } from '../DashboardFooter';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-hidden selection:bg-brand-500/30 transition-colors duration-500 relative z-0">
      {/* Background topography and organic gradients */}
      <div className="absolute inset-0 bg-topo-pattern z-[-2] mix-blend-overlay opacity-30 dark:opacity-20" />
      <div className="absolute inset-0 pointer-events-none z-[-1] perspective-1000">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] organic-shape bg-amber-400/20 dark:bg-amber-900/20 blur-[120px] transform-style-3d translate-z-[-100px] animate-sway" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] organic-shape-2 bg-emerald-500/10 dark:bg-emerald-900/20 blur-[100px] transform-style-3d translate-z-[-200px] animate-sway" style={{ animationDelay: '2s' }} />
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col h-full relative z-10 w-full overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 w-full scroll-smooth">
          {children}
          <DashboardFooter />
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
