export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameLevel {
  id: number;
  title: string;
  story: string;
  vocabularyWords: {
    word: string;
    definition: string;
    translation: string;
  }[];
  questions: {
    word: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export interface GameState {
  difficulty: Difficulty;
  isGameStarted: boolean;
  currentLevel: number;
  gameProgress: Record<number, boolean>;
  isLoading: boolean;
  error: string | null;
  gameLevels: Record<Difficulty, GameLevel[]>;
}

export interface GameActions {
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: () => void;
  resetGame: () => void;
  completeLevel: (levelId: number) => void;
  isLevelCompleted: (levelId: number) => boolean;
  getLevelData: (levelId: number) => GameLevel | null;
  generateAIStory: (difficulty: Difficulty) => Promise<void>;
}