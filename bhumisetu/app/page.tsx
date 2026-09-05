'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale } from '@/components/providers/LocaleProvider';
import {
  HiOutlineChartBarSquare, HiOutlineMap, HiOutlineUserGroup,
  HiOutlineDocumentText, HiOutlineDevicePhoneMobile, HiOutlineShieldCheck,
  HiOutlineBolt, HiOutlineGlobeAlt
} from 'react-icons/hi2';

// Animated counter component
function AnimatedCounter({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const step = end / (duration * 60);
          const animate = () => {
            start += step;
            if (start < end) {
              setCount(Math.floor(start));
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          animate();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>;
}

const features = [
  { icon: HiOutlineChartBarSquare, titleKey: 'dashboard', color: 'from-saffron to-orange-500', desc: 'Real-time KPI tracking across states with interactive analytics' },
  { icon: HiOutlineMap, titleKey: 'map', color: 'from-emerald to-teal-500', desc: 'GIS-enabled cadastral mapping with parcel boundary visualization' },
  { icon: HiOutlineUserGroup, titleKey: 'rrTracker', color: 'from-royal to-indigo-500', desc: 'Family-wise R&R entitlement tracking with milestone progress' },
  { icon: HiOutlineDocumentText, titleKey: 'documents', color: 'from-purple-500 to-pink-500', desc: 'Tamper-proof document repository with blockchain audit trails' },
  { icon: HiOutlineDevicePhoneMobile, titleKey: 'field', color: 'from-cyan-500 to-blue-500', desc: 'Offline-first PWA for field officers with GPS geotagging' },
  { icon: HiOutlineShieldCheck, titleKey: 'admin', color: 'from-rose-500 to-red-500', desc: 'Role-based access for Central, State, District & Project levels' },
];

export default function HomePage() {
  const { t } = useLocale();

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full 
          bg-gradient-to-br from-saffron/15 to-transparent blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full 
          bg-gradient-to-br from-emerald/10 to-transparent blur-3xl animate-[float_8s_ease-in-out_infinite_1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full 
          bg-gradient-to-br from-royal/5 to-transparent blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
            bg-saffron/10 border border-saffron/20 text-saffron text-xs font-medium mb-8">
            <HiOutlineBolt className="w-3.5 h-3.5" />
            SIH 2026 • Ministry of Rural Development
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-saffron via-white to-emerald 
              bg-clip-text text-transparent">
              {t('hero', 'heading')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            {t('hero', 'description')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-saffron to-orange-600 
                text-white font-semibold text-lg shadow-lg shadow-saffron/25
                hover:shadow-saffron/40 hover:scale-105 transition-all duration-300"
            >
              {t('hero', 'cta_dashboard')}
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 rounded-2xl border border-white/20 
                text-white font-semibold text-lg
                hover:bg-white/5 hover:border-white/30 hover:scale-105 transition-all duration-300"
            >
              {t('hero', 'cta_projects')}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="relative px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: t('stats', 'totalProjects'), value: 214, suffix: '+' },
              { label: t('stats', 'landAcquired'), value: 39300, suffix: ' Ha' },
              { label: t('stats', 'compensationDisbursed'), value: 14650, suffix: ' Cr' },
              { label: t('stats', 'familiesResettled'), value: 40900, suffix: '+' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center 
                hover:bg-white/10 transition-all duration-300 group">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-saffron to-emerald 
                  bg-clip-text text-transparent mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs md:text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                End-to-End Platform
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From gazette notification to physical possession — every step digitized, tracked, and transparent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="glass rounded-2xl p-6 h-full hover:bg-white/10 
                  transition-all duration-300 group cursor-pointer 
                  hover:scale-[1.02] hover:shadow-xl">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} 
                    flex items-center justify-center mb-4 shadow-lg
                    group-hover:scale-110 transition-transform duration-300`}>
                    <feat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t('nav', feat.titleKey)}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Support Banner */}
      <section className="relative px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12 text-center"
        >
          <HiOutlineGlobeAlt className="w-12 h-12 text-saffron mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Available in 22 Indian Languages
          </h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            हिन्दी • বাংলা • తెలుగు • தமிழ் • मराठी • ગુજરાતી • ಕನ್ನಡ • മലയാളം • ਪੰਜਾਬੀ • ଓଡ଼ିଆ • اردو and more...
          </p>
          <p className="text-xs text-slate-500">
            RTL support for Urdu, Sindhi & Kashmiri • WCAG 2.1 Accessible
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-500">
          <p>BhumiSetu (भूमि-सेतु) • Ministry of Rural Development • Government of India</p>
          <p className="mt-1 text-xs text-slate-600">
            Smart India Hackathon 2026 • Problem Statement SIH26016
          </p>
        </div>
      </footer>
    </div>
  );
}
