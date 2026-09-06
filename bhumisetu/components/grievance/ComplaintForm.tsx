'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/components/providers/LocaleProvider';
import {
  HiOutlineUser, HiOutlinePhone, HiOutlineDocumentText,
  HiOutlineCheckCircle, HiOutlineArrowRight, HiOutlineArrowLeft,
  HiOutlineClipboardDocumentCheck
} from 'react-icons/hi2';

interface ComplaintFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  submittedId: string | null;
}

const categories = [
  'Compensation Delay',
  'Unfair Valuation',
  'R&R Non-Compliance',
  'Possession Dispute',
  'Environmental Concern',
  'Other',
];

const categoryIcons: Record<string, string> = {
  'Compensation Delay': '💰',
  'Unfair Valuation': '📊',
  'R&R Non-Compliance': '🏠',
  'Possession Dispute': '⚖️',
  'Environmental Concern': '🌿',
  'Other': '📋',
};

export default function ComplaintForm({ onSubmit, isSubmitting, submittedId }: ComplaintFormProps) {
  const { t } = useLocale();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    category: '',
    description: '',
    projectName: '',
    district: '',
    state: '',
  });

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canNext = () => {
    if (step === 1) return form.name.trim().length >= 2 && form.phone.trim().length >= 10;
    if (step === 2) return form.category && form.description.trim().length >= 20;
    return true;
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  // Success state
  if (submittedId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto"
        >
          <HiOutlineCheckCircle className="w-10 h-10 text-emerald-400" />
        </motion.div>
        <h3 className="text-xl font-bold text-heading">Complaint Filed Successfully!</h3>
        <div className="glass rounded-xl p-4 inline-block">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Your Ticket ID</p>
          <p className="text-2xl font-bold text-saffron tabular-nums">{submittedId}</p>
        </div>
        <p className="text-sm text-muted max-w-md mx-auto">
          Save this ticket ID to track your complaint status. You will receive updates via SMS on your registered phone number.
        </p>
        <p className="text-xs text-muted">
          SLA: Your complaint will be resolved within <span className="text-heading font-medium">30 days</span>.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
              transition-all duration-300
              ${step >= s
                ? 'bg-gradient-to-r from-saffron to-emerald text-white shadow-md'
                : 'bg-black/5 dark:bg-white/5 text-muted'
              }`}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && (
              <div className={`w-12 h-0.5 transition-all duration-300
                ${step > s ? 'bg-saffron' : 'bg-black/10 dark:bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center text-[11px] text-muted flex justify-center gap-8">
        <span className={step === 1 ? 'text-heading font-medium' : ''}>Personal Info</span>
        <span className={step === 2 ? 'text-heading font-medium' : ''}>Complaint Details</span>
        <span className={step === 3 ? 'text-heading font-medium' : ''}>Review & Submit</span>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="glass rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-400 border border-emerald-500/20">
              <HiOutlineClipboardDocumentCheck className="w-4 h-4 flex-shrink-0" />
              {t('grievance', 'noLoginRequired') || 'No login required'} — File anonymously with just your name and phone.
            </div>

            <div>
              <label className="text-xs text-muted uppercase tracking-wider mb-1.5 block">
                <HiOutlineUser className="inline w-3.5 h-3.5 mr-1" />
                {t('grievance', 'name') || 'Your Name'} *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 dark:bg-white/5
                  border border-transparent focus:border-saffron/50 focus:outline-none
                  text-heading placeholder:text-muted transition-all duration-200"
              />
            </div>

            <div>
              <label className="text-xs text-muted uppercase tracking-wider mb-1.5 block">
                <HiOutlinePhone className="inline w-3.5 h-3.5 mr-1" />
                {t('grievance', 'phone') || 'Phone Number'} *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 dark:bg-white/5
                  border border-transparent focus:border-saffron/50 focus:outline-none
                  text-heading placeholder:text-muted transition-all duration-200 tabular-nums"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted uppercase tracking-wider mb-1.5 block">District</label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  placeholder="e.g. Palghar"
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 dark:bg-white/5
                    border border-transparent focus:border-saffron/50 focus:outline-none
                    text-heading placeholder:text-muted transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-xs text-muted uppercase tracking-wider mb-1.5 block">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 dark:bg-white/5
                    border border-transparent focus:border-saffron/50 focus:outline-none
                    text-heading placeholder:text-muted transition-all duration-200"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs text-muted uppercase tracking-wider mb-2 block">
                Complaint Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateField('category', cat)}
                    className={`px-3 py-3 rounded-xl text-xs font-medium text-left
                      transition-all duration-200 border
                      ${form.category === cat
                        ? 'bg-saffron/15 border-saffron/50 text-saffron shadow-sm'
                        : 'bg-black/5 dark:bg-white/5 border-transparent text-body hover:border-saffron/30'
                      }`}
                  >
                    <span className="text-lg mr-1.5">{categoryIcons[cat]}</span>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted uppercase tracking-wider mb-1.5 block">
                Project Name (Optional)
              </label>
              <input
                type="text"
                value={form.projectName}
                onChange={(e) => updateField('projectName', e.target.value)}
                placeholder="e.g. Delhi-Mumbai Expressway"
                className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 dark:bg-white/5
                  border border-transparent focus:border-saffron/50 focus:outline-none
                  text-heading placeholder:text-muted transition-all duration-200"
              />
            </div>

            <div>
              <label className="text-xs text-muted uppercase tracking-wider mb-1.5 block">
                <HiOutlineDocumentText className="inline w-3.5 h-3.5 mr-1" />
                {t('grievance', 'description') || 'Describe your issue'} * (min 20 chars)
              </label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Provide details about your complaint. Include survey numbers, dates, amounts, and any other relevant information..."
                className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 dark:bg-white/5
                  border border-transparent focus:border-saffron/50 focus:outline-none
                  text-heading placeholder:text-muted transition-all duration-200 resize-none"
              />
              <p className="text-[10px] text-muted mt-1 text-right tabular-nums">
                {form.description.length} characters
              </p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold text-heading">Review Your Complaint</h4>
            <div className="glass rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Name</span>
                <span className="text-heading font-medium">{form.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Phone</span>
                <span className="text-heading font-medium tabular-nums">{form.phone}</span>
              </div>
              {form.district && (
                <div className="flex justify-between">
                  <span className="text-muted">Location</span>
                  <span className="text-heading font-medium">{form.district}, {form.state}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Category</span>
                <span className="text-saffron font-medium">{categoryIcons[form.category]} {form.category}</span>
              </div>
              {form.projectName && (
                <div className="flex justify-between">
                  <span className="text-muted">Project</span>
                  <span className="text-heading font-medium">{form.projectName}</span>
                </div>
              )}
              <div className="border-t border-black/5 dark:border-white/5 pt-3">
                <p className="text-muted text-xs mb-1">Description</p>
                <p className="text-body text-xs leading-relaxed">{form.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium
              text-muted hover:text-heading transition-colors"
          >
            <HiOutlineArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        ) : <div />}

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext()}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-medium
              bg-gradient-to-r from-saffron to-emerald text-white shadow-md
              hover:shadow-lg transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <HiOutlineArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold
              bg-gradient-to-r from-saffron to-emerald text-white shadow-md
              hover:shadow-lg transition-all duration-200
              disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>{t('grievance', 'submit') || 'Submit Complaint'}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
