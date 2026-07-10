import { NavLink, useLocation } from 'react-router-dom';
import { PenSquare, FileText, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: PenSquare, label: 'Compose' },
  { to: '/drafts', icon: FileText, label: 'Drafts' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass-heavy border-t border-nm-border-subtle"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-[56px]',
                isActive
                  ? 'text-nm-accent'
                  : 'text-nm-text-tertiary'
              )}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
