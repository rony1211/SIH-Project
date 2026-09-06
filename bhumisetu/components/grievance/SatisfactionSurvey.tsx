'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';

interface SatisfactionSurveyProps {
  existingRating?: number | null;
  existingComment?: string;
}

export default function SatisfactionSurvey({ existingRating, existingComment }: SatisfactionSurveyProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(existingRating || 0);
  const [comment, setComment] = useState(existingComment || '');
  const [submitted, setSubmitted] = useState(!!existingRating);

  const labels: Record<number, string> = {
    1: 'Very Unsatisfied',
    2: 'Unsatisfied',
    3: 'Neutral',
    4: 'Satisfied',
    5: 'Very Satisfied',
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted && existingRating) {
    return (
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-heading uppercase tracking-wider">Your Feedback</h4>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <HiStar
              key={s}
              className={`w-6 h-6 ${s <= (existingRating) ? 'text-saffron' : 'text-black/10 dark:text-white/10'}`}
            />
          ))}
          <span className="text-sm font-medium text-heading ml-1">
            {labels[existingRating]}
          </span>
        </div>
        {existingComment && (
          <p className="text-xs text-body italic">"{existingComment}"</p>
        )}
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4 space-y-2"
      >
        <p className="text-lg">🙏</p>
        <p className="text-sm font-semibold text-heading">Thank you for your feedback!</p>
        <p className="text-xs text-muted">Your response helps us improve resolution quality.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-heading uppercase tracking-wider">
        How satisfied are you with the resolution?
      </h4>

      {/* Star Rating */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(s)}
          >
            <motion.div
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {s <= (hovered || selected) ? (
                <HiStar className="w-8 h-8 text-saffron drop-shadow-sm" />
              ) : (
                <HiOutlineStar className="w-8 h-8 text-black/20 dark:text-white/20 hover:text-saffron/40" />
              )}
            </motion.div>
          </button>
        ))}
        {(hovered || selected) > 0 && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-medium text-saffron ml-1"
          >
            {labels[hovered || selected]}
          </motion.span>
        )}
      </div>

      {/* Comment */}
      {selected > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <textarea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)..."
            className="w-full px-4 py-2.5 rounded-xl text-xs bg-black/5 dark:bg-white/5
              border border-transparent focus:border-saffron/50 focus:outline-none
              text-heading placeholder:text-muted transition-all duration-200 resize-none"
          />
          <button
            onClick={handleSubmit}
            className="mt-2 px-5 py-2 rounded-xl text-xs font-bold
              bg-gradient-to-r from-saffron to-emerald text-white shadow-md
              hover:shadow-lg transition-all duration-200"
          >
            Submit Feedback
          </button>
        </motion.div>
      )}
    </div>
  );
}
