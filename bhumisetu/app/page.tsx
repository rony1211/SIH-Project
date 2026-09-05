'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocale } from '@/components/providers/LocaleProvider';
import {
  HiOutlineChartBarSquare, HiOutlineMap, HiOutlineUserGroup,
  HiOutlineDocumentText, HiOutlineDevicePhoneMobile, HiOutlineShieldCheck,
  HiOutlineBolt, HiOutlineGlobeAlt, HiPlay
} from 'react-icons/hi2';
import AcquisitionChart from '@/components/dashboard/AcquisitionChart';
import RecentActivity from '@/components/dashboard/RecentActivity';

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
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="relative overflow-hidden bg-background min-h-screen">
      {/* Cinematic Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full 
          bg-gradient-to-br from-saffron/20 to-transparent blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full 
          bg-gradient-to-br from-emerald/15 to-transparent blur-[120px] animate-[pulse_10s_ease-in-out_infinite_1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] rounded-full 
          bg-gradient-to-br from-royal/5 to-transparent blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="z-10 relative"
        >
          {/* Badge */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
              bg-saffron/10 border border-saffron/20 text-saffron text-xs font-medium mb-8"
          >
            <HiOutlineBolt className="w-4 h-4 animate-pulse" />
            <span className="tracking-wide uppercase">Live on National Server</span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="bg-gradient-to-b from-foreground to-muted bg-clip-text text-transparent block">
              Digital Land
            </span>
            <span className="bg-gradient-to-r from-saffron via-emerald to-royal bg-clip-text text-transparent">
              Acquisition & Management
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-12 leading-relaxed">
            {t('hero', 'description')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-saffron to-orange-600 
                text-white font-semibold text-lg overflow-hidden transition-all duration-300
                hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative flex items-center gap-2">
                {t('hero', 'cta_dashboard')}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link
              href="/projects"
              className="px-8 py-4 rounded-2xl border border-black/10 dark:border-white/20 
                text-heading font-semibold text-lg glass
                hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/20 dark:hover:border-white/30 
                hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              <HiPlay className="w-5 h-5 text-emerald" />
              Watch Demo
            </Link>
          </div>
        </motion.div>

        {/* Live Cinematic Dashboard Preview (3D Perspective) */}
        <motion.div 
          initial={{ opacity: 0, y: 100, rotateX: 25, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, rotateX: 10, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          style={{ perspective: 2000, y }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Glow Behind Dashboard */}
          <div className="absolute inset-0 bg-gradient-to-t from-saffron/20 to-emerald/20 blur-[100px] -z-10" />
          
          <div className="rounded-3xl border border-black/10 dark:border-white/10 glass-dark p-2 md:p-6 shadow-2xl shadow-black/50 overflow-hidden relative">
            
            {/* Browser Header Mock */}
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <div className="mx-auto bg-black/5 dark:bg-white/5 px-4 py-1 rounded-md text-xs text-muted flex items-center gap-2 font-mono">
                <HiOutlineGlobeAlt className="w-3 h-3" />
                bhumisetu.gov.in/live-monitor
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pointer-events-none opacity-90 scale-95 origin-top">
              <div className="md:col-span-2">
                <AcquisitionChart title="Live: Notified vs Acquired (Today)" />
              </div>
              <div className="hidden md:block">
                <RecentActivity title="Real-time Feed" />
              </div>
            </div>
            
            {/* Overlay Gradient to fade out bottom */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="relative px-6 py-20 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: t('stats', 'totalProjects'), value: 214, suffix: '+' },
              { label: t('stats', 'landAcquired'), value: 39300, suffix: ' Ha' },
              { label: t('stats', 'compensationDisbursed'), value: 14650, suffix: ' Cr' },
              { label: t('stats', 'familiesResettled'), value: 40900, suffix: '+' },
            ].map((stat, i) => (
              <div key={i} className="glass-dark rounded-3xl p-8 text-center 
                hover:border-saffron/30 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-saffron to-emerald 
                  bg-clip-text text-transparent mb-3">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm md:text-base font-medium text-muted group-hover:text-heading transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-6 py-24 z-10 bg-black/3 dark:bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-heading to-muted bg-clip-text text-transparent">
                End-to-End Platform
              </span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              From gazette notification to physical possession — every step digitized, tracked, and transparent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="glass-dark rounded-3xl p-8 h-full 
                  transition-all duration-500 group cursor-pointer 
                  hover:scale-[1.03] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]
                  border border-black/5 dark:border-white/5 hover:border-white/10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} 
                    flex items-center justify-center mb-6 shadow-lg
                    group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <feat.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-3">
                    {t('nav', feat.titleKey)}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Support Banner */}
      <section className="relative px-6 py-24 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass-dark rounded-[3rem] p-10 md:p-16 text-center border border-emerald/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-saffron/10 via-emerald/10 to-royal/10 opacity-50" />
          <HiOutlineGlobeAlt className="w-16 h-16 text-emerald mx-auto mb-6 relative z-10 animate-[spin_10s_linear_infinite]" />
          <h3 className="text-3xl md:text-5xl font-bold mb-6 relative z-10 text-heading">
            Accessible in 22 Indian Languages
          </h3>
          <p className="text-lg text-muted mb-8 max-w-3xl mx-auto relative z-10 leading-relaxed">
            हिन्दी • বাংলা • తెలుగు • தமிழ் • मराठी • ગુજરાતી • ಕನ್ನಡ • മലയാളം • ਪੰਜਾਬੀ • ଓଡ଼ିଆ • اردو and more...
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass bg-white/5 text-sm font-medium text-heading relative z-10">
            RTL support for Urdu, Sindhi & Kashmiri • WCAG 2.1 Accessible
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 border-t border-black/10 dark:border-white/10 z-10 bg-black/5 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron to-emerald flex items-center justify-center font-bold text-white">
              भू
            </div>
            <div>
              <p className="font-bold text-heading">BhumiSetu (भूमि-सेतु)</p>
              <p className="text-xs text-muted">Ministry of Rural Development • Government of India</p>
            </div>
          </div>
          <p className="text-xs font-medium text-muted bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full">
            Smart India Hackathon 2026 • SIH26016
          </p>
        </div>
      </footer>
    </div>
  );
}
