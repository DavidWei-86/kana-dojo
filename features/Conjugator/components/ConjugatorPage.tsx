'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Languages, Share2, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

import useConjugatorStore from '../store/useConjugatorStore';
import ConjugatorInput from './ConjugatorInput';
import ConjugationResults from './ConjugationResults';
import ConjugationHistory from './ConjugationHistory';

interface ConjugatorPageProps {
  /** Current locale for i18n */
  locale?: string;
}

/**
 * ConjugatorPage - Main page component for the Japanese Verb Conjugator
 *
 * Features:
 * - Composes all conjugator components
 * - Responsive layout (mobile-first)
 * - ARIA labels and keyboard navigation
 * - URL parameter handling for shareable links
 * - URL state synchronization
 * - aria-live regions for dynamic content updates
 *
 * Requirements: 5.1, 5.4, 5.5, 5.6, 10.1, 10.2, 10.3, 12.1, 12.2, 12.3
 */
export default function ConjugatorPage({ locale = 'en' }: ConjugatorPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initializedFromUrl = useRef(false);
  const [shareButtonState, setShareButtonState] = useState<
    'idle' | 'copied' | 'error'
  >('idle');

  const {
    inputText,
    result,
    isLoading,
    error,
    expandedCategories,
    history,
    setInputText,
    conjugate,
    toggleCategory,
    expandAllCategories,
    collapseAllCategories,
    copyForm,
    copyAllForms,
    deleteFromHistory,
    clearHistory,
    restoreFromHistory,
    initFromUrlParams,
  } = useConjugatorStore();

  // Handle URL parameters for shareable conjugations (Requirements: 12.2)
  useEffect(() => {
    if (initializedFromUrl.current) return;

    const verb = searchParams.get('verb') || searchParams.get('v');

    if (verb) {
      const hasParams = initFromUrlParams({ verb });
      if (hasParams) {
        initializedFromUrl.current = true;
      }
    }
  }, [searchParams, initFromUrlParams]);

  // Update URL when verb is conjugated (Requirements: 12.1)
  useEffect(() => {
    if (!result) return;

    const currentVerb = searchParams.get('verb') || searchParams.get('v');
    const newVerb = result.verb.dictionaryForm;

    // Only update URL if the verb has changed
    if (currentVerb !== newVerb) {
      const newUrl = `${pathname}?verb=${encodeURIComponent(newVerb)}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [result, searchParams, pathname, router]);

  // Handle conjugate action
  const handleConjugate = useCallback(() => {
    if (inputText.trim().length > 0 && !isLoading) {
      conjugate();
    }
  }, [inputText, isLoading, conjugate]);

  // Handle share button click (Requirements: 12.3)
  const handleShare = useCallback(async () => {
    if (!result) return;

    const shareUrl = `${window.location.origin}${pathname}?verb=${encodeURIComponent(result.verb.dictionaryForm)}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareButtonState('copied');
      setTimeout(() => setShareButtonState('idle'), 2000);
    } catch {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${result.verb.dictionaryForm} Conjugation - KanaDojo`,
            text: `Check out the conjugation of ${result.verb.dictionaryForm} (${result.verb.romaji})`,
            url: shareUrl,
          });
        } catch {
          setShareButtonState('error');
          setTimeout(() => setShareButtonState('idle'), 2000);
        }
      } else {
        setShareButtonState('error');
        setTimeout(() => setShareButtonState('idle'), 2000);
      }
    }
  }, [result, pathname]);

  return (
    <div
      className='mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-10 sm:py-20'
      role='main'
      aria-label='Japanese verb conjugator'
    >
      {/* Immersive Header Section */}
      <header className='relative mb-20 flex flex-col items-center text-center'>
        <div className='absolute -top-10 -left-10 h-64 w-64 rounded-full bg-(--main-color)/5 blur-3xl' />

        <div className='flex flex-col items-center'>
          <div
            className='mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-(--background-color) shadow-2xl ring-1 shadow-black/5 ring-(--border-color)/20'
            aria-hidden='true'
          >
            <Languages className='h-8 w-8 text-(--main-color)' />
          </div>

          <h1 className='relative flex flex-col items-center gap-2'>
            <span className='text-xs font-black tracking-[0.5em] text-(--secondary-color) uppercase opacity-40'>
              The Grand Lexicon
            </span>
            <span className='flex flex-col text-5xl font-black tracking-tighter text-(--main-color) sm:text-7xl lg:text-9xl'>
              <span>Japanese Verb</span>
              <span className='font-serif text-(--secondary-color) italic opacity-80 sm:-mt-4'>
                Conjugator
              </span>
            </span>
          </h1>

          <p className='mt-10 max-w-xl text-lg leading-relaxed font-medium text-(--secondary-color) opacity-60 sm:text-2xl'>
            Precision morphological synthesis. Explore every transformation with
            surgical clarity.
          </p>
        </div>

        {/* Share Result (Integrated into the background flow) */}
        {result && (
          <div className='animate-in fade-in zoom-in mt-10 duration-700'>
            <button
              onClick={handleShare}
              className={cn(
                'group flex items-center gap-4 rounded-full border border-(--border-color)/30 bg-(--background-color)/50 px-8 py-4 backdrop-blur-xl transition-all hover:scale-105 active:scale-95',
                shareButtonState === 'copied' &&
                  'border-transparent bg-green-500 text-white',
              )}
            >
              {shareButtonState === 'copied' ? (
                <>
                  <Check className='h-5 w-5' />
                  <span className='text-sm font-black tracking-widest uppercase'>
                    Copied
                  </span>
                </>
              ) : (
                <>
                  <Share2 className='h-5 w-5 text-(--main-color)' />
                  <span className='text-sm font-black tracking-widest text-(--main-color) uppercase'>
                    Sync Result
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </header>

      {/* Unified Canvas Layout */}
      <div className='relative flex flex-col lg:flex-row lg:items-start lg:gap-16'>
        {/* Main Interaction Canvas */}
        <div className='flex flex-1 flex-col gap-24'>
          {/* Persistent Core Input Field - Elevated, not carded */}
          <section
            className='relative z-10 mx-auto w-full max-w-4xl'
            aria-label='Verb Search'
          >
            <div className='absolute -inset-4 rounded-[3rem] bg-gradient-to-b from-(--main-color)/5 to-transparent opacity-50 blur-2xl' />
            <ConjugatorInput
              value={inputText}
              onChange={setInputText}
              onConjugate={handleConjugate}
              isLoading={isLoading}
              error={error}
            />
          </section>

          {/* Result Flow Area */}
          <section className='min-h-[600px]' aria-label='Conjugation Results'>
            <ConjugationResults
              result={result}
              isLoading={isLoading}
              expandedCategories={expandedCategories}
              onToggleCategory={toggleCategory}
              onExpandAll={expandAllCategories}
              onCollapseAll={collapseAllCategories}
              onCopyForm={copyForm}
              onCopyAll={copyAllForms}
            />
          </section>
        </div>

        {/* Architectural Sidebar - History as a timeline record */}
        <aside
          className='shrink-0 pt-20 lg:sticky lg:top-24 lg:w-[320px] lg:pt-0'
          aria-label='Conjugation history'
        >
          <div className='relative'>
            {/* Background architectural line */}
            <div className='absolute top-0 -left-8 hidden h-full w-[1px] bg-gradient-to-b from-(--border-color)/50 via-(--border-color)/20 to-transparent lg:block' />

            <ConjugationHistory
              entries={history}
              onSelect={restoreFromHistory}
              onDelete={deleteFromHistory}
              onClearAll={clearHistory}
            />
          </div>
        </aside>
      </div>

      {/* Keyboard shortcuts info (screen reader only) */}
      <div className='sr-only' aria-live='polite'>
        <p>
          Keyboard shortcuts: Press Enter in the input field to conjugate. Press
          Escape to clear the input. Use Tab to navigate between elements.
        </p>
      </div>
    </div>
  );
}
