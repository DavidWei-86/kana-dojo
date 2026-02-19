'use client';

import { useState } from 'react';
import { Trash2, Clock, X, History } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ActionButton } from '@/shared/components/ui/ActionButton';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import type { HistoryEntry, VerbType } from '../types';

interface ConjugationHistoryProps {
  /** History entries to display */
  entries: HistoryEntry[];
  /** Callback when an entry is selected */
  onSelect: (entry: HistoryEntry) => void;
  /** Callback when an entry is deleted */
  onDelete: (id: string) => void;
  /** Callback when all entries are cleared */
  onClearAll: () => void;
}

/**
 * ConjugationHistory - Displays recent conjugated verbs
 *
 * Features:
 * - Recent verbs as clickable chips/cards
 * - Delete button for individual entries
 * - Clear all button
 * - Proper ARIA labels and roles
 *
 * Requirements: 8.2, 8.3, 8.4, 10.2
 */
export default function ConjugationHistory({
  entries,
  onSelect,
  onDelete,
  onClearAll,
}: ConjugationHistoryProps) {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Empty state
  if (entries.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-3xl px-6 py-12 text-center',
          'border border-dashed border-(--border-color)/50 bg-(--card-color)/20',
          'text-(--secondary-color)',
        )}
        role='region'
        aria-label='Conjugation history'
      >
        <div
          className={cn(
            'mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-(--secondary-color)/5',
          )}
          aria-hidden='true'
        >
          <History className='h-8 w-8 opacity-20' />
        </div>
        <h4 className='text-sm font-black tracking-widest uppercase opacity-40'>
          Archive Empty
        </h4>
        <p className='mt-2 text-xs leading-relaxed font-medium opacity-30'>
          Your linguistic transformations will be archived here for quick
          retrieval.
        </p>
      </div>
    );
  }

  return (
    <div
      className='flex flex-col gap-10 transition-all duration-700'
      role='region'
      aria-label='Conjugation history'
    >
      {/* Header - Sidebar Style */}
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-3'>
            <div className='h-1.5 w-1.5 rounded-full bg-(--main-color)' />
            <h3 className='text-xs font-black tracking-[0.4em] text-(--main-color) uppercase opacity-40'>
              Archive Log
            </h3>
          </div>
          <p className='text-[10px] font-bold text-(--secondary-color) opacity-20'>
            {entries.length} morphs recorded
          </p>
        </div>

        {/* Clear all button - Ghost style */}
        <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
          <AlertDialogTrigger asChild>
            <button
              className='flex h-10 w-10 items-center justify-center rounded-full text-(--secondary-color) opacity-20 transition-all hover:bg-red-500/10 hover:text-red-500 hover:opacity-100 active:scale-90'
              aria-label='Clear all history archive'
            >
              <Trash2 className='h-4 w-4' />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent
            className={cn(
              'border-(--border-color) bg-(--background-color)',
              'rounded-3xl',
            )}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className='text-3xl font-black tracking-tighter text-(--main-color)'>
                Purge Archive?
              </AlertDialogTitle>
              <AlertDialogDescription className='text-base leading-relaxed font-semibold text-(--secondary-color)/60'>
                This will permanently delete all your linguistic transformation
                records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='flex-row gap-4 pt-6'>
              <ActionButton
                colorScheme='secondary'
                borderRadius='full'
                borderBottomThickness={0}
                className='flex-1 border border-(--border-color)/50 text-xs font-black tracking-widest uppercase'
                onClick={() => setClearDialogOpen(false)}
              >
                Retain
              </ActionButton>
              <ActionButton
                colorScheme='main'
                borderRadius='full'
                borderBottomThickness={0}
                className='flex-1 bg-red-600 text-xs font-black tracking-widest uppercase hover:bg-red-700'
                onClick={() => {
                  onClearAll();
                  setClearDialogOpen(false);
                }}
              >
                Purge All
              </ActionButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* History entries as a minimalist architectural list */}
      <div
        className='flex flex-col gap-1'
        role='list'
        aria-label='Recent conjugated verbs'
      >
        {entries.map(entry => (
          <HistoryRecord
            key={entry.id}
            entry={entry}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual history record component
 */
function HistoryRecord({
  entry,
  onSelect,
  onDelete,
}: {
  entry: HistoryEntry;
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
}) {
  const typeInfo = getVerbTypeInfo(entry.verbType);

  return (
    <div
      className={cn(
        'group relative flex items-center justify-between transition-all duration-500',
        'hover:translate-x-3',
      )}
      role='listitem'
    >
      {/* Clickable verb part */}
      <button
        onClick={() => onSelect(entry)}
        className='flex min-w-0 flex-1 items-center gap-6 py-4 text-left focus:outline-none'
        aria-label={`Conjugate ${entry.verb}`}
      >
        {/* Type Dot Marker */}
        <div
          className={cn(
            'flex h-2 w-2 shrink-0 rounded-full transition-all duration-700 group-hover:scale-[2]',
            typeInfo.bgClass,
            'bg-opacity-100', // Override the bgOpacity for the dot
          )}
          style={{
            backgroundColor: typeInfo.textClass.split('text-')[1].split('-')[0],
          }} // Hacky way to get the color, better to define properly
        />

        <div className='flex min-w-0 flex-col'>
          <span
            className='font-japanese truncate text-2xl font-black tracking-tighter text-(--main-color) opacity-40 transition-all duration-500 group-hover:opacity-100'
            lang='ja'
          >
            {entry.verb}
          </span>
          <div className='mt-1 flex items-center gap-3'>
            <span className='text-[8px] font-black tracking-widest text-(--secondary-color) uppercase opacity-20'>
              {typeInfo.label}
            </span>
            <div className='h-[1px] w-4 bg-(--border-color)/50' />
            <span className='text-[8px] font-black tracking-widest text-(--secondary-color) uppercase opacity-20'>
              {formatTimestamp(entry.timestamp)}
            </span>
          </div>
        </div>
      </button>

      {/* Action Area - Subtle Trash */}
      <div className='flex items-center pb-4 opacity-0 transition-all duration-500 group-hover:opacity-100'>
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete(entry.id);
          }}
          className='flex h-8 w-8 items-center justify-center rounded-full text-red-500/30 transition-all hover:bg-red-500/10 hover:text-red-500'
          aria-label={`Remove ${entry.verb}`}
        >
          <X className='h-3 w-3' aria-hidden='true' />
        </button>
      </div>
    </div>
  );
}

/**
 * Format timestamp to relative time
 */
function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return new Date(timestamp).toLocaleDateString();
}

/**
 * Get display info for verb type
 */
function getVerbTypeInfo(type: VerbType): {
  label: string;
  abbrev: string;
  bgClass: string;
  textClass: string;
} {
  switch (type) {
    case 'godan':
      return {
        label: 'Godan (五段)',
        abbrev: 'G',
        bgClass: 'bg-blue-500/20',
        textClass: 'text-blue-500',
      };
    case 'ichidan':
      return {
        label: 'Ichidan (一段)',
        abbrev: 'I',
        bgClass: 'bg-green-500/20',
        textClass: 'text-green-500',
      };
    case 'irregular':
      return {
        label: 'Irregular',
        abbrev: '!',
        bgClass: 'bg-purple-500/20',
        textClass: 'text-purple-500',
      };
    default:
      return {
        label: 'Unknown',
        abbrev: '?',
        bgClass: 'bg-gray-500/20',
        textClass: 'text-gray-500',
      };
  }
}
