'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useThemeStore } from '@/lib/store';
import { locales, languageNames } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { HiGlobeAlt } from 'react-icons/hi2';

export default function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const { isDark } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
          border transition-all duration-300 text-sm text-body
          hover:bg-black/5 dark:hover:bg-white/10"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        }}
        aria-label="Select Language"
      >
        <HiGlobeAlt className="w-4 h-4 text-saffron" />
        <span className="hidden sm:inline">{languageNames[locale]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 max-h-80 overflow-y-auto 
          rounded-xl shadow-2xl z-50 p-2"
          style={{
            background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <div className="grid grid-cols-2 gap-1">
            {locales.map((loc: Locale) => (
              <button
                key={loc}
                onClick={() => { setLocale(loc); setIsOpen(false); }}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                  ${locale === loc
                    ? 'bg-saffron/20 text-saffron font-medium'
                    : 'text-body hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
              >
                {languageNames[loc]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
