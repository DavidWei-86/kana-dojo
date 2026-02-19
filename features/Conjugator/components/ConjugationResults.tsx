'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Expand, Minimize2, Copy, Check, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ActionButton } from '@/shared/components/ui/ActionButton';
import type {
  ConjugationResult,
  ConjugationCategory as CategoryType,
  ConjugationForm,
} from '../types';
import { ALL_CONJUGATION_CATEGORIES } from '../types';
import VerbInfoCard from './VerbInfoCard';
import ConjugationCategory from './ConjugationCategory';

interface ConjugationResultsProps {
  /** Conjugation result to display */
  result: ConjugationResult | null;
  /** Whether conjugation is in progress */
  isLoading: boolean;
  /** Currently expanded categories */
  expandedCategories: CategoryType[];
  /** Callback to toggle a category */
  onToggleCategory: (category: CategoryType) => void;
  /** Callback to expand all categories */
  onExpandAll: () => void;
  /** Callback to collapse all categories */
  onCollapseAll: () => void;
  /** Callback to copy a single form */
  onCopyForm: (form: ConjugationForm) => void;
  /** Callback to copy all forms */
  onCopyAll: () => void;
}

/**
 * ConjugationResults - Displays all conjugated forms organized by category
 *
 * Features:
 * - VerbInfoCard showing verb type and stem
 * - All ConjugationCategory components
 * - Expand all / collapse all buttons
 * - Copy all button
 * - aria-live region for dynamic content updates
 *
 * Requirements: 5.2, 6.2, 10.2
 */
export default function ConjugationResults({
  result,
  isLoading,
  expandedCategories,
  onToggleCategory,
  onExpandAll,
  onCollapseAll,
  onCopyForm,
  onCopyAll,
}: ConjugationResultsProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const previousResultRef = useRef<ConjugationResult | null>(null);

  // Group forms by category
  const formsByCategory = useMemo(() => {
    if (!result) return new Map<CategoryType, ConjugationForm[]>();

    const grouped = new Map<CategoryType, ConjugationForm[]>();
    for (const form of result.forms) {
      const existing = grouped.get(form.category) || [];
      existing.push(form);
      grouped.set(form.category, existing);
    }
    return grouped;
  }, [result]);

  // Get categories that have forms
  const categoriesWithForms = useMemo(() => {
    return ALL_CONJUGATION_CATEGORIES.filter(
      cat => (formsByCategory.get(cat)?.length ?? 0) > 0,
    );
  }, [formsByCategory]);

  // Check if all categories are expanded
  const allExpanded = useMemo(() => {
    return categoriesWithForms.every(cat => expandedCategories.includes(cat));
  }, [categoriesWithForms, expandedCategories]);

  // Update status message when result changes for screen readers
  useEffect(() => {
    if (result && result !== previousResultRef.current) {
      setStatusMessage(
        `Conjugation complete for ${result.verb.dictionaryForm}. ${result.forms.length} forms available across ${categoriesWithForms.length} categories.`,
      );
      previousResultRef.current = result;
    } else if (isLoading) {
      setStatusMessage('Conjugating verb, please wait...');
    }
  }, [result, isLoading, categoriesWithForms.length]);

  // Handle copy all with feedback
  const handleCopyAll = useCallback(() => {
    onCopyAll();
    setCopiedAll(true);
    setStatusMessage('All conjugation forms copied to clipboard.');
    setTimeout(() => setCopiedAll(false), 2000);
  }, [onCopyAll]);

  // Loading state
  if (isLoading) {
    return (
      <div className='animate-in fade-in flex min-h-[500px] flex-col items-center justify-center gap-12 py-20 text-center duration-1000'>
        <div className='relative flex h-40 w-40 items-center justify-center'>
          <div className='absolute inset-0 animate-ping rounded-full bg-(--main-color)/5 blur-3xl' />
          <Loader2 className='h-16 w-16 animate-spin text-(--main-color) opacity-20' />
        </div>
        <div className='space-y-6'>
          <h3 className='text-xs font-black tracking-[1em] text-(--secondary-color) uppercase opacity-40'>
            Linguistic Synthesis
          </h3>
          <p className='mx-auto max-w-sm text-3xl font-black tracking-tighter text-(--main-color) sm:text-5xl'>
            Reconstructing morphological matrix...
          </p>
        </div>
      </div>
    );
  }

  // No result state
  if (!result) {
    return (
      <div className='animate-in fade-in slide-in-from-bottom-8 flex flex-col items-center justify-center py-40 text-center duration-1000'>
        <div className='relative mb-16 flex h-32 w-32 items-center justify-center text-8xl opacity-10 blur-[1px] grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0'>
          🏯
        </div>
        <h3 className='text-xs font-black tracking-[1em] text-(--secondary-color) uppercase opacity-40'>
          System Standby
        </h3>
        <p className='mt-6 max-w-md text-3xl font-black tracking-tighter text-(--main-color) opacity-80 sm:text-5xl'>
          Initiate a search to synthesize transformations.
        </p>
      </div>
    );
  }

  return (
    <div
      className='animate-in fade-in slide-in-from-bottom-12 flex flex-col gap-32 duration-1000'
      role='region'
      aria-label='Conjugation results'
      aria-busy={isLoading}
    >
      {/* Screen reader status announcements */}
      <div
        className='sr-only'
        role='status'
        aria-live='polite'
        aria-atomic='true'
      >
        {statusMessage}
      </div>

      {/* Results Header and Actions - Very spacious and architectural */}
      <div className='flex flex-col gap-12'>
        <div className='flex flex-wrap items-end justify-between gap-12'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4 text-xs font-black tracking-[0.5em] text-(--secondary-color) uppercase opacity-40'>
              <div className='h-[1px] w-12 bg-(--main-color)' />
              <span>Result Synthesis</span>
            </div>
            <h2 className='text-6xl font-black tracking-tighter text-(--main-color) sm:text-8xl lg:text-9xl'>
              Deep Analysis
            </h2>
          </div>

          <div className='flex items-center gap-6'>
            <button
              onClick={allExpanded ? onCollapseAll : onExpandAll}
              className='flex items-center gap-3 text-[10px] font-black tracking-widest text-(--secondary-color) uppercase opacity-50 transition-all hover:text-(--main-color) hover:opacity-100'
            >
              {allExpanded ? (
                <Minimize2 className='h-4 w-4' />
              ) : (
                <Expand className='h-4 w-4' />
              )}
              <span>{allExpanded ? 'Contract View' : 'Expand Matrix'}</span>
            </button>

            <ActionButton
              onClick={handleCopyAll}
              gradient
              borderRadius='full'
              borderBottomThickness={0}
              className='h-14 !w-auto px-10 text-[10px] font-black tracking-widest uppercase shadow-(--main-color)/20 shadow-2xl transition-all hover:scale-105 active:scale-95'
            >
              {copiedAll ? (
                <>
                  <Check className='mr-3 h-5 w-5' />
                  <span>Archive Exported</span>
                </>
              ) : (
                <>
                  <Copy className='mr-3 h-5 w-5' />
                  <span>Export All Synths</span>
                </>
              )}
            </ActionButton>
          </div>
        </div>

        {/* The verb info section - expansive, no-box flow */}
        <section className='relative'>
          <div className='pointer-events-none absolute top-1/2 -right-10 -left-10 h-1/2 bg-(--main-color)/2 blur-[120px]' />
          <VerbInfoCard verb={result.verb} />
        </section>
      </div>

      {/* Conjugation Categories - Vertical Index Approach (No Boxes) */}
      <div className='flex flex-col gap-24'>
        {categoriesWithForms.map((category, index) => (
          <div key={category} className='relative'>
            {/* Architectural Marker */}
            <div className='absolute top-0 -left-12 hidden text-[10px] font-black text-(--main-color) opacity-10 lg:block'>
              {String(index + 1).padStart(2, '0')}
            </div>

            <ConjugationCategory
              category={category}
              forms={formsByCategory.get(category) || []}
              isExpanded={expandedCategories.includes(category)}
              onToggle={() => onToggleCategory(category)}
              onCopy={onCopyForm}
            />

            {/* Integrated subtle separator */}
            <div className='mt-16 h-[1px] w-full bg-gradient-to-r from-(--border-color)/50 via-(--border-color)/10 to-transparent' />
          </div>
        ))}
      </div>

      {/* Technical Summary Footer */}
      <footer className='flex flex-col items-center gap-8 py-20 text-center opacity-40'>
        <div className='h-12 w-[1px] bg-(--main-color)' />
        <div className='flex flex-col gap-1'>
          <p className='text-[11px] font-black tracking-[0.3em] uppercase'>
            Total Transformations: {result.forms.length}
          </p>
          <p className='text-[10px] font-bold'>
            All synths generated on precision linguistic models
          </p>
        </div>
      </footer>
    </div>
  );
}
