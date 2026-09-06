'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useSidebarStore, useThemeStore } from '@/lib/store';
import {
  HiOutlineHome, HiOutlineChartBarSquare, HiOutlineFolder,
  HiOutlineMap, HiOutlineUserGroup, HiOutlineDocumentText,
  HiOutlineMegaphone, HiOutlineTrophy, HiOutlineDevicePhoneMobile, HiOutlineCog6Tooth,
  HiOutlineXMark
} from 'react-icons/hi2';

const navItems = [
  { href: '/', icon: HiOutlineHome, key: 'home' },
  { href: '/dashboard', icon: HiOutlineChartBarSquare, key: 'dashboard' },
  { href: '/projects', icon: HiOutlineFolder, key: 'projects' },
  { href: '/map', icon: HiOutlineMap, key: 'map' },
  { href: '/rr-tracker', icon: HiOutlineUserGroup, key: 'rrTracker' },
  { href: '/documents', icon: HiOutlineDocumentText, key: 'documents' },
  { href: '/grievance', icon: HiOutlineMegaphone, key: 'grievance' },
  { href: '/officers', icon: HiOutlineTrophy, key: 'officers' },
  { href: '/field', icon: HiOutlineDevicePhoneMobile, key: 'field' },
  { href: '/admin', icon: HiOutlineCog6Tooth, key: 'admin' },
];

export default function Sidebar() {
  const { t } = useLocale();
  const { isOpen, close } = useSidebarStore();
  const { isDark } = useThemeStore();
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:top-16 lg:w-64 lg:z-30`}
        style={{
          background: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRight: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        {/* Close button (mobile) */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-lg font-bold bg-gradient-to-r from-saffron to-emerald 
            bg-clip-text text-transparent">
            BhumiSetu
          </span>
          <button onClick={close} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10">
            <HiOutlineXMark className="w-5 h-5 text-heading" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 mt-2 lg:mt-4">
          {navItems.map(({ href, icon: Icon, key }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-gradient-to-r from-saffron/20 to-emerald/10 text-saffron border-l-3 border-saffron'
                    : 'text-body hover:bg-black/5 dark:hover:bg-white/5 hover:text-heading'
                  }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 
                  group-hover:scale-110 ${isActive ? 'text-saffron' : ''}`} />
                <span>{t('nav', key)}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-saffron animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Govt branding */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <div className="p-3 rounded-xl border text-center"
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            }}>
            <p className="text-[10px] text-muted uppercase tracking-widest">
              Ministry of Rural Development
            </p>
            <p className="text-[10px] text-muted mt-1 opacity-60">
              Government of India
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
