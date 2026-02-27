import { create } from 'zustand';
import { appendAttempt } from '@/shared/lib/sessionHistory';

interface ClassicSessionState {
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  logAttempt: (attempt: {
    questionId: string;
    questionPrompt: string;
    expectedAnswers: string[];
    userAnswer: string;
    inputKind: 'pick' | 'type' | 'word_building';
    isCorrect: boolean;
    timeTakenMs?: number;
    optionsShown?: string[];
    extra?: Record<string, unknown>;
  }) => void;
}

const useClassicSessionStore = create<ClassicSessionState>((set, get) => ({
  activeSessionId: null,
  setActiveSessionId: id => set({ activeSessionId: id }),
  logAttempt: attempt => {
    const sessionId = get().activeSessionId;
    if (!sessionId) return;
    void appendAttempt(sessionId, attempt);
  },
}));

export default useClassicSessionStore;

