import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { CommandPalette } from '../ui/CommandPalette';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-nm-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-nm-border-subtle bg-nm-void/80">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-nm-text-secondary hover:text-nm-text transition-colors p-1"
          >
            <Menu size={20} />
          </button>
          <span className="font-display text-sm font-bold text-nm-text tracking-tight">
            NullMail
          </span>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-0 lg:pb-0">
          <div className="gradient-mesh min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
}
