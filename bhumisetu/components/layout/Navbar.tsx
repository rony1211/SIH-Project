'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useThemeStore, useSidebarStore } from '@/lib/store';
import LanguageSelector from './LanguageSelector';
import { HiOutlineBars3, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';

export default function Navbar() {
  const { t } = useLocale();
  const { isDark, toggle: toggleTheme } = useThemeStore();
  const { toggle: toggleSidebar } = useSidebarStore();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors lg:hidden"
              aria-label="Toggle Menu"
            >
              <HiOutlineBars3 className="w-6 h-6 text-heading" />
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron to-emerald
                flex items-center justify-center font-bold text-white text-lg
                group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-saffron/20">
                भू
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-saffron to-emerald
                  bg-clip-text text-transparent">
                  BhumiSetu
                </h1>
                <p className="text-[10px] text-muted -mt-1 tracking-wider">
                  {t('app', 'subtitle')}
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Nav links (desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { href: '/dashboard', label: t('nav', 'dashboard') },
              { href: '/projects', label: t('nav', 'projects') },
              { href: '/map', label: t('nav', 'map') },
              { href: '/rr-tracker', label: t('nav', 'rrTracker') },
              { href: '/grievance', label: t('nav', 'grievance') },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${pathname === link.href
                    ? 'bg-saffron/15 text-saffron'
                    : 'text-body hover:bg-black/5 dark:hover:bg-white/5 hover:text-heading'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            <LanguageSelector />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <HiOutlineSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <HiOutlineMoon className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
