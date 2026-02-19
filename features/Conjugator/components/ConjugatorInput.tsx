'use client';

import { useCallback, useRef, useEffect } from 'react';
import { X, Keyboard, Search, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ActionButton } from '@/shared/components/ui/ActionButton';
import type { ConjugationError } from '../types';

interface ConjugatorInputProps {
  /** Current input value */
  value: string;
  /** Callback when input changes */
  onChange: (value: string) => void;
  /** Callback when conjugate is triggered */
  onConjugate: () => void;
  /** Whether conjugation is in progress */
  isLoading: boolean;
  /** Error from conjugation attempt */
  error: ConjugationError | null;
}

/**
 * ConjugatorInput - Text input component for Japanese verb conjugation
 *
 * Features:
 * - Japanese font support
 * - Conjugate button with loading state
 * - Enter key shortcut to conjugate
 * - Validation error display
 * - Proper ARIA labels and roles
 *
 * Requirements: 1.1, 1.3, 1.4, 5.1, 5.3, 10.2
 */
export default function ConjugatorInput({
  value,
  onChange,
  onConjugate,
  isLoading,
  error,
}: ConjugatorInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isDisabled = isLoading;
  const canConjugate = value.trim().length > 0 && !isLoading;

  // Handle keyboard shortcut (Enter to conjugate, Escape to clear)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (canConjugate) {
          onConjugate();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (value.length > 0) {
          onChange('');
        }
      }
    },
    [canConjugate, onConjugate, value, onChange],
  );

  // Handle text change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  // Handle clear button
  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className='group relative flex w-full flex-col gap-10 transition-all duration-700'
      role='search'
      aria-label='Japanese verb conjugation input'
    >
      {/* Input Field Container - The Hero Element */}
      <div className='relative flex flex-col gap-6'>
        <div className='relative flex items-center'>
          {/* Subtle architectural background for the input only */}
          <div className='absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-(--main-color)/20 via-(--main-color)/5 to-(--main-color)/20 opacity-0 blur-xl transition-opacity duration-1000 group-focus-within:opacity-100' />

          <input
            ref={inputRef}
            type='text'
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder='e.g. 食べる, 行く, する...'
            className={cn(
              'relative h-24 w-full rounded-3xl px-10 sm:h-32 sm:px-14',
              'bg-(--background-color)/40 text-4xl text-(--main-color) placeholder:text-(--secondary-color)/20 sm:text-6xl',
              'font-japanese tracking-tighter backdrop-blur-3xl',
              'border border-(--border-color)/20 shadow-2xl shadow-black/5 transition-all duration-500',
              'focus:scale-[1.01] focus:border-(--main-color)/40 focus:ring-0 focus:outline-none',
              error && 'border-red-500/50',
              isDisabled && 'cursor-not-allowed opacity-60',
            )}
            aria-labelledby='verb-input-label'
            aria-describedby={
              error ? 'input-error verb-input-hint' : 'verb-input-hint'
            }
            aria-invalid={!!error}
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            lang='ja'
          />

          {/* Search Icon (floating inside) */}
          <div className='absolute left-6 hidden opacity-20 sm:block'>
            <Search className='h-8 w-8 text-(--main-color)' />
          </div>

          {/* Clear button */}
          {value.length > 0 && !isDisabled && (
            <button
              onClick={handleClear}
              className={cn(
                'absolute right-8 flex h-12 w-12 items-center justify-center rounded-full transition-all sm:right-10',
                'bg-(--secondary-color)/5 text-(--secondary-color) hover:bg-(--secondary-color)/10 hover:text-(--main-color)',
              )}
              aria-label='Clear input field'
            >
              <X className='h-6 w-6' aria-hidden='true' />
            </button>
          )}
        </div>

        {/* Floating Hint Overlay */}
        <p
          className='absolute -top-8 left-4 text-[10px] font-black tracking-[0.4em] text-(--secondary-color) uppercase opacity-30'
          id='verb-input-hint'
        >
          Morphology Engine Input
        </p>

        {/* Error Message Section - Floating below input */}
        {error && (
          <div
            id='input-error'
            className={cn(
              'absolute -bottom-16 left-0 flex items-center gap-3 rounded-2xl px-6 py-3',
              'border border-red-500/20 bg-red-500/5 backdrop-blur-md',
              'animate-in fade-in slide-in-from-top-4 text-xs font-black tracking-widest text-red-500 uppercase',
            )}
            role='alert'
            aria-live='polite'
          >
            <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-red-500' />
            {getErrorMessage(error)}
          </div>
        )}
      </div>

      {/* Primary Catalyst Button & Hints */}
      <div className='mt-4 flex flex-col items-center gap-8 sm:flex-row sm:justify-between'>
        <ActionButton
          onClick={onConjugate}
          disabled={!canConjugate}
          gradient
          borderRadius='full'
          borderBottomThickness={0}
          className={cn(
            'h-16 w-full text-xs font-black tracking-[0.3em] uppercase sm:h-20 sm:w-auto sm:px-16',
            'shadow-(--main-color)/10 shadow-2xl transition-all hover:scale-110 active:scale-95',
            'disabled:opacity-20 disabled:grayscale disabled:hover:scale-100',
          )}
          aria-label={isLoading ? 'Conjugating...' : 'Initiate Conjugation'}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <div className='flex items-center gap-4'>
              <Loader2 className='h-6 w-6 animate-spin' />
              <span>Synthesizing</span>
            </div>
          ) : (
            'Conjugate'
          )}
        </ActionButton>

        {/* High-end minimalist keyboard hints */}
        <div className='flex items-center gap-6 opacity-30'>
          <div className='flex items-center gap-3'>
            <div className='h-1 w-1 rounded-full bg-(--secondary-color)' />
            <span className='text-[9px] font-black tracking-widest text-(--secondary-color) uppercase'>
              Enter to synth
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <div className='h-1 w-1 rounded-full bg-(--secondary-color)' />
            <span className='text-[9px] font-black tracking-widest text-(--secondary-color) uppercase'>
              Esc to purge
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Get user-friendly error message from error code
 */
function getErrorMessage(error: ConjugationError): string {
  switch (error.code) {
    case 'EMPTY_INPUT':
      return 'Please enter a Japanese verb';
    case 'INVALID_CHARACTERS':
      return 'Please enter a valid Japanese verb using hiragana, katakana, or kanji';
    case 'UNKNOWN_VERB':
      return 'This verb is not recognized. Please check the spelling or try the dictionary form';
    case 'AMBIGUOUS_VERB':
      return 'This input could be multiple verbs. Please be more specific';
    case 'CONJUGATION_FAILED':
      return error.message || 'An unexpected error occurred';
    default:
      return error.message || 'An error occurred';
  }
}
