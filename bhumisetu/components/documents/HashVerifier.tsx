'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShieldCheck, HiOutlineClipboardDocument, HiOutlineCheckCircle } from 'react-icons/hi2';

interface HashVerifierProps {
  hash: string;
  verified?: boolean;
  compact?: boolean;
}

export default function HashVerifier({ hash, verified = true, compact = false }: HashVerifierProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const truncatedHash = `${hash.slice(0, 8)}...${hash.slice(-8)}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {verified ? (
          <HiOutlineShieldCheck className="w-4 h-4 text-emerald flex-shrink-0" />
        ) : (
          <HiOutlineShieldCheck className="w-4 h-4 text-warning flex-shrink-0" />
        )}
        <span className="text-xs font-mono text-muted truncate max-w-[100px]">{truncatedHash}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass
          hover:surface-hover transition-all duration-200 group"
      >
        {verified ? (
          <div className="relative">
            <HiOutlineShieldCheck className="w-5 h-5 text-emerald" />
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-emerald/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <HiOutlineShieldCheck className="w-5 h-5 text-warning animate-pulse" />
        )}
        <span className="text-xs font-mono text-muted">{truncatedHash}</span>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full
          ${verified
            ? 'bg-emerald/10 text-emerald'
            : 'bg-warning/10 text-warning'
          }`}>
          {verified ? 'Verified' : 'Pending'}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 glass-dark rounded-xl p-4 shadow-2xl
              border border-black/10 dark:border-white/10 min-w-[320px]"
          >
            {/* Chain link visualization */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-3 h-3 rounded-sm bg-gradient-to-br from-emerald to-teal-500 rotate-45"
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted uppercase tracking-widest">Blockchain Hash Chain</span>
            </div>

            {/* Full hash */}
            <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3 mb-3">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">SHA-256 Document Hash</p>
              <p className="text-xs font-mono text-heading break-all leading-relaxed">{hash}</p>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg
                bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10
                transition-colors text-xs font-medium text-body"
            >
              {copied ? (
                <>
                  <HiOutlineCheckCircle className="w-4 h-4 text-emerald" />
                  <span className="text-emerald">Copied to clipboard</span>
                </>
              ) : (
                <>
                  <HiOutlineClipboardDocument className="w-4 h-4" />
                  <span>Copy full hash</span>
                </>
              )}
            </button>

            {/* Verification status */}
            <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
              ${verified
                ? 'bg-emerald/10 text-emerald'
                : 'bg-warning/10 text-warning'
              }`}>
              <HiOutlineShieldCheck className="w-4 h-4" />
              {verified
                ? 'Integrity Verified — No tampering detected'
                : 'Verification Pending — Awaiting ledger confirmation'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
