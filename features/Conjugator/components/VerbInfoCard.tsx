'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Info } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { VerbInfo, VerbType, IrregularType } from '../types';

interface VerbInfoCardProps {
  /** Verb information from classification */
  verb: VerbInfo;
}

/**
 * VerbInfoCard - Displays detected verb type and stem information
 *
 * Features:
 * - Shows verb type (Godan/Ichidan/Irregular)
 * - Displays verb stem
 * - Expandable section with conjugation rule explanation
 * - Proper ARIA labels and roles
 *
 * Requirements: 9.1, 9.2, 9.3, 10.2
 */
export default function VerbInfoCard({ verb }: VerbInfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const verbTypeInfo = getVerbTypeInfo(verb.type, verb.irregularType);

  return (
    <div
      className='flex flex-col gap-16 transition-all duration-700'
      role='region'
      aria-label={`Verb information for ${verb.dictionaryForm}`}
    >
      {/* Main info header - Massive Typography */}
      <div className='flex flex-col gap-12'>
        <div className='flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between'>
          <div className='flex items-start gap-8'>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-4'>
                <div className='h-3 w-3 rounded-full bg-(--main-color)' />
                <span className='text-xs font-black tracking-[0.4em] text-(--secondary-color) uppercase opacity-40'>
                  Primary Entry
                </span>
              </div>

              <div className='flex flex-col'>
                <h3
                  className='font-japanese text-7xl font-black tracking-tighter text-(--main-color) sm:text-8xl lg:text-9xl'
                  lang='ja'
                >
                  {verb.dictionaryForm}
                </h3>
                <div className='flex items-center gap-6 text-xl font-medium text-(--secondary-color) opacity-40 sm:text-3xl'>
                  <span className='font-japanese' lang='ja'>
                    {verb.reading}
                  </span>
                  <div className='h-2 w-2 rounded-full bg-(--border-color)' />
                  <span className='italic'>{verb.romaji}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col items-end gap-2 text-right'>
            <span className='text-[10px] font-black tracking-widest text-(--main-color) uppercase opacity-30'>
              Object Status
            </span>
            <span className='text-xl font-black text-(--main-color)'>
              Verified Synthesis
            </span>
          </div>
        </div>

        {/* Informational Grid - Architectural, not boxes */}
        <div
          className='grid grid-cols-1 gap-12 sm:grid-cols-3'
          role='group'
          aria-label='Verb classification details'
        >
          {/* Verb Type */}
          <div className='flex flex-col gap-4'>
            <div className='h-[1px] w-full bg-(--border-color)/30' />
            <span className='text-[10px] font-black tracking-[0.4em] text-(--secondary-color) uppercase opacity-30'>
              Linguistic Class
            </span>
            <span
              className={cn('text-2xl font-black', verbTypeInfo.colorClass)}
            >
              {verbTypeInfo.label}
            </span>
          </div>

          {/* Stem */}
          <div className='flex flex-col gap-4'>
            <div className='h-[1px] w-full bg-(--border-color)/30' />
            <span className='text-[10px] font-black tracking-[0.4em] text-(--secondary-color) uppercase opacity-30'>
              Root Segment
            </span>
            <span
              className='font-japanese text-3xl font-black text-(--main-color)'
              lang='ja'
            >
              {verb.stem || '—'}
            </span>
          </div>

          {/* Ending */}
          <div className='flex flex-col gap-4'>
            <div className='h-[1px] w-full bg-(--border-color)/30' />
            <span className='text-[10px] font-black tracking-[0.4em] text-(--secondary-color) uppercase opacity-30'>
              Terminator
            </span>
            <span
              className='font-japanese text-3xl font-black text-(--main-color)'
              lang='ja'
            >
              {verb.ending || '—'}
            </span>
          </div>
        </div>

        {/* Compound Alert - Seamless bar */}
        {verb.compoundPrefix && (
          <div className='animate-in fade-in flex items-center gap-6 rounded-2xl bg-(--main-color)/5 p-6 duration-500'>
            <Info className='h-6 w-6 text-(--main-color) opacity-50' />
            <div className='flex flex-col gap-0.5'>
              <span className='text-[9px] font-black tracking-widest text-(--main-color) uppercase opacity-40'>
                Complex Morph Detected
              </span>
              <span className='text-sm font-medium text-(--main-color) opacity-80'>
                Prefix identified:{' '}
                <span
                  className='font-japanese font-black underline decoration-(--main-color)/20'
                  lang='ja'
                >
                  {verb.compoundPrefix}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Rules Disclosure - Integrated divider style */}
      <section className='border-y border-(--border-color)/10 py-4'>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='group flex w-full items-center justify-between text-left transition-all'
          aria-expanded={isExpanded}
        >
          <div className='flex items-center gap-4'>
            <div className='h-1.5 w-1.5 rounded-full bg-(--main-color) transition-all group-hover:scale-150' />
            <span className='text-[10px] font-black tracking-[0.4em] text-(--secondary-color) uppercase opacity-30 transition-opacity group-hover:opacity-100'>
              Transformation Rules Manual
            </span>
          </div>
          <div className='flex items-center gap-4 text-[9px] font-black tracking-widest text-(--main-color) uppercase opacity-0 transition-opacity group-hover:opacity-100'>
            <span>{isExpanded ? 'Collapse logic' : 'Reveal logic'}</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-500',
                isExpanded && 'rotate-180',
              )}
            />
          </div>
        </button>

        <div
          id='verb-explanation'
          className={cn(
            'grid transition-all duration-700 ease-in-out',
            isExpanded
              ? 'mt-12 grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className='overflow-hidden'>
            <div className='flex flex-col gap-12 pb-8'>
              <div className='flex max-w-2xl flex-col gap-4'>
                <h4 className='text-xs font-black tracking-widest text-(--main-color) uppercase opacity-50'>
                  Overview
                </h4>
                <p className='text-xl leading-relaxed font-medium text-(--secondary-color) opacity-60'>
                  {verbTypeInfo.description}
                </p>
              </div>

              <div className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
                {verbTypeInfo.rules.map((rule, idx) => (
                  <div
                    key={idx}
                    className='flex gap-6 border-l border-(--main-color)/10 pl-6'
                  >
                    <span className='text-[10px] font-black text-(--main-color) opacity-20'>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className='text-sm leading-relaxed font-medium text-(--secondary-color) opacity-70'>
                      {rule}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Get display information for verb type
 */
function getVerbTypeInfo(
  type: VerbType,
  irregularType?: IrregularType,
): {
  label: string;
  colorClass: string;
  description: string;
  rules: string[];
} {
  if (type === 'irregular' && irregularType) {
    return getIrregularTypeInfo(irregularType);
  }

  switch (type) {
    case 'godan':
      return {
        label: 'Godan (五段)',
        colorClass: 'text-blue-500',
        description:
          'Godan verbs (also called u-verbs or Group I verbs) conjugate across five vowel sounds. The final kana changes based on the conjugation form.',
        rules: [
          'The stem changes based on the vowel grade (a, i, u, e, o)',
          'Te-form has sound changes based on the ending (って, んで, いて, etc.)',
          'Negative form uses the a-grade stem + ない',
          'Masu-form uses the i-grade stem + ます',
        ],
      };
    case 'ichidan':
      return {
        label: 'Ichidan (一段)',
        colorClass: 'text-green-500',
        description:
          'Ichidan verbs (also called ru-verbs or Group II verbs) have a simpler conjugation pattern. The る ending is replaced with the appropriate suffix.',
        rules: [
          'Remove る and add the conjugation suffix',
          'Te-form: stem + て',
          'Negative form: stem + ない',
          'Masu-form: stem + ます',
          'Potential form has both traditional (-られる) and colloquial (-れる) forms',
        ],
      };
    case 'irregular':
      return {
        label: 'Irregular',
        colorClass: 'text-purple-500',
        description:
          'This verb has irregular conjugation patterns that must be memorized.',
        rules: ['Conjugation patterns do not follow standard rules'],
      };
    default:
      return {
        label: 'Unknown',
        colorClass: 'text-(--secondary-color)',
        description: 'Unable to determine verb type.',
        rules: [],
      };
  }
}

/**
 * Get display information for specific irregular verb types
 */
function getIrregularTypeInfo(irregularType: IrregularType): {
  label: string;
  colorClass: string;
  description: string;
  rules: string[];
} {
  switch (irregularType) {
    case 'suru':
      return {
        label: 'する-verb',
        colorClass: 'text-purple-500',
        description:
          'する (to do) is one of the two main irregular verbs in Japanese. It has unique conjugation patterns.',
        rules: [
          'Te-form: して',
          'Negative: しない',
          'Masu-form: します',
          'Potential: できる (separate verb)',
          'Passive: される',
          'Causative: させる',
        ],
      };
    case 'kuru':
      return {
        label: '来る-verb',
        colorClass: 'text-purple-500',
        description:
          '来る (to come) is one of the two main irregular verbs. The reading changes between く and こ depending on the form.',
        rules: [
          'Te-form: 来て (きて)',
          'Negative: 来ない (こない)',
          'Masu-form: 来ます (きます)',
          'Potential: 来られる (こられる)',
          'Past: 来た (きた)',
        ],
      };
    case 'aru':
      return {
        label: 'ある-verb',
        colorClass: 'text-orange-500',
        description:
          'ある (to exist, for inanimate objects) has a unique negative form.',
        rules: [
          'Negative: ない (not あらない)',
          'Other forms follow Godan patterns',
          'Te-form: あって',
          'Past: あった',
        ],
      };
    case 'iku':
      return {
        label: '行く-verb',
        colorClass: 'text-orange-500',
        description:
          '行く (to go) is mostly regular but has an irregular te-form.',
        rules: [
          'Te-form: 行って (not 行いて)',
          'Ta-form: 行った (not 行いた)',
          'Other forms follow regular Godan patterns',
        ],
      };
    case 'honorific':
      return {
        label: 'Honorific',
        colorClass: 'text-pink-500',
        description:
          'Honorific verbs (くださる, なさる, いらっしゃる, おっしゃる, ござる) have irregular masu-forms.',
        rules: [
          'Masu-form uses ます instead of ります',
          'Example: くださる → くださいます (not くださります)',
          'Other forms follow Godan patterns',
        ],
      };
    default:
      return {
        label: 'Irregular',
        colorClass: 'text-purple-500',
        description: 'This verb has irregular conjugation patterns.',
        rules: [],
      };
  }
}
