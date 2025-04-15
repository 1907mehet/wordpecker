export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameStatus = 'idle' | 'memorizing' | 'choosing' | 'correct' | 'incorrect' | 'completed';

export interface WordPair {
  english: string;
  turkish: string;
}

export interface Door {
  english: string;
  turkish: string;
  isCorrect: boolean;
}

export interface GameRound {
  roundNumber: number;
  wordPairs: WordPair[];
  doors: Door[];
  correctDoorIndex: number;
}

export interface VocabGameState {
  difficulty: Difficulty;
  currentRound: number;
  totalRounds: number;
  score: number;
  highScore: number;
  gameStatus: GameStatus;
  currentGameRound: GameRound | null;
  memorizeTimeSeconds: number;
  choosingTimeSeconds: number; // Added time limit for door selection
}

export interface VocabGameActions {
  initializeGame: (difficulty?: Difficulty, totalRounds?: number) => void;
  startNextRound: () => void;
  finishMemorizing: () => void;
  selectDoor: (doorIndex: number) => void;
  timeExpired: () => void; // Added action for time expiration
  resetGame: () => void;
}