import { motion } from 'framer-motion';
import { Moon, Sun, Palette, Info, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthProvider';
import { APP_VERSION } from '@/lib/version';

export function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();
  const { signOut } = useAuth();

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto space-y-8 pb-24 lg:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-nm-text tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-nm-text-tertiary mt-1">
          Manage your app preferences
        </p>
      </motion.div>

      {/* Appearance */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 mb-1">
          <Palette size={16} className="text-nm-text-tertiary" />
          <h2 className="text-sm font-semibold text-nm-text uppercase tracking-wider">
            Appearance
          </h2>
        </div>
        <div className="p-4 rounded-2xl bg-nm-surface/40 border border-nm-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-nm-text">Theme</p>
              <p className="text-xs text-nm-text-tertiary mt-0.5">
                Currently using {theme} mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={cn(
                'relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer',
                theme === 'dark' ? 'bg-nm-accent/20' : 'bg-nm-accent'
              )}
            >
              <motion.div
                layout
                className={cn(
                  'absolute top-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md',
                  theme === 'dark' ? 'left-0.5' : 'left-[calc(100%-1.625rem)]'
                )}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {theme === 'dark' ? (
                  <Moon size={13} className="text-nm-accent" />
                ) : (
                  <Sun size={13} className="text-amber-500" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </motion.section>

      {/* About & Account */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 mb-1">
          <Info size={16} className="text-nm-text-tertiary" />
          <h2 className="text-sm font-semibold text-nm-text uppercase tracking-wider">
            About & Account
          </h2>
        </div>
        <div className="p-4 rounded-2xl bg-nm-surface/40 border border-nm-border-subtle space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-nm-border-subtle/50 pb-4">
            <span className="text-nm-text-secondary text-sm">Version</span>
            <span className="text-nm-text font-medium text-sm">{APP_VERSION}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-nm-text-secondary text-sm">Ecosystem</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-nm-accent/10 text-nm-accent border border-nm-accent/20">
              The Null Projects
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <Button variant="danger" size="sm" icon={<LogOut size={14}/>} onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
