import { NavLink, useLocation } from 'react-router-dom';
import { Mail, FileText, Users, Settings, X, PenSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/', icon: PenSquare, label: 'Compose' },
  { to: '/drafts', icon: FileText, label: 'Drafts' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-nm-accent to-nm-accent-glow flex items-center justify-center shadow-lg shadow-nm-accent/20">
              <Mail size={16} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-nm-text">
              NullMail
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-nm-text-secondary hover:text-nm-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-nm-muted">
          Navigate
        </p>
        {navItems.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-white/[0.06] text-nm-text'
                  : 'text-nm-text-secondary hover:text-nm-text hover:bg-white/[0.03]'
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  'transition-colors duration-200',
                  isActive
                    ? 'text-nm-accent'
                    : 'text-nm-text-tertiary group-hover:text-nm-text-secondary'
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1 h-1 rounded-full bg-nm-accent"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 mt-auto border-t border-nm-border-subtle pt-4">
        <div className="px-5 mt-auto pt-2 pb-2 text-center opacity-40 hover:opacity-100 transition-opacity">
          <p className="text-nm-muted text-[11px] font-medium tracking-wide">
            NullMail v1.0.0
          </p>
          <p className="text-[10px] text-nm-muted/50">The Null Projects</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] h-full bg-nm-void/80 border-r border-nm-border-subtle flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[260px] bg-nm-void z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
