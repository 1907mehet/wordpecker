import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VocabGameState, VocabGameActions, WordPair, GameRound, Difficulty } from '@/types/vocab-game';

// Word pairs for different difficulty levels
const wordPairs: Record<Difficulty, WordPair[]> = {
  easy: [
    { english: "house", turkish: "ev" },
    { english: "water", turkish: "su" },
    { english: "book", turkish: "kitap" },
    { english: "friend", turkish: "arkadaş" },
    { english: "school", turkish: "okul" },
    { english: "teacher", turkish: "öğretmen" },
    { english: "student", turkish: "öğrenci" },
    { english: "family", turkish: "aile" },
    { english: "mother", turkish: "anne" },
    { english: "father", turkish: "baba" },
    { english: "brother", turkish: "erkek kardeş" },
    { english: "sister", turkish: "kız kardeş" },
    { english: "car", turkish: "araba" },
    { english: "door", turkish: "kapı" },
    { english: "window", turkish: "pencere" },
    { english: "table", turkish: "masa" },
    { english: "chair", turkish: "sandalye" },
    { english: "food", turkish: "yemek" },
    { english: "bread", turkish: "ekmek" },
    { english: "milk", turkish: "süt" },
  ],
  medium: [
    { english: "happiness", turkish: "mutluluk" },
    { english: "sadness", turkish: "üzüntü" },
    { english: "knowledge", turkish: "bilgi" },
    { english: "experience", turkish: "deneyim" },
    { english: "opportunity", turkish: "fırsat" },
    { english: "challenge", turkish: "zorluk" },
    { english: "success", turkish: "başarı" },
    { english: "failure", turkish: "başarısızlık" },
    { english: "courage", turkish: "cesaret" },
    { english: "patience", turkish: "sabır" },
    { english: "responsibility", turkish: "sorumluluk" },
    { english: "freedom", turkish: "özgürlük" },
    { english: "justice", turkish: "adalet" },
    { english: "peace", turkish: "barış" },
    { english: "environment", turkish: "çevre" },
    { english: "technology", turkish: "teknoloji" },
    { english: "science", turkish: "bilim" },
    { english: "culture", turkish: "kültür" },
    { english: "history", turkish: "tarih" },
    { english: "future", turkish: "gelecek" },
  ],
  hard: [
    { english: "procrastination", turkish: "erteleme" },
    { english: "perseverance", turkish: "azim" },
    { english: "ambiguity", turkish: "belirsizlik" },
    { english: "phenomenon", turkish: "fenomen" },
    { english: "perspective", turkish: "bakış açısı" },
    { english: "contradiction", turkish: "çelişki" },
    { english: "hypothesis", turkish: "hipotez" },
    { english: "paradigm", turkish: "paradigma" },
    { english: "metaphor", turkish: "mecaz" },
    { english: "paradox", turkish: "paradoks" },
    { english: "synthesis", turkish: "sentez" },
    { english: "analysis", turkish: "analiz" },
    { english: "inference", turkish: "çıkarım" },
    { english: "deduction", turkish: "tümdengelim" },
    { english: "induction", turkish: "tümevarım" },
    { english: "correlation", turkish: "korelasyon" },
    { english: "causation", turkish: "nedensellik" },
    { english: "empirical", turkish: "ampirik" },
    { english: "theoretical", turkish: "teorik" },
    { english: "pragmatic", turkish: "pragmatik" },
  ]
};

// Function to generate a game round with 3 word pairs
const generateGameRound = (difficulty: Difficulty, roundNumber: number): GameRound => {
  const availableWords = [...wordPairs[difficulty]];
  const selectedWords: WordPair[] = [];
  
  // Select 3 random words for this round
  for (let i = 0; i < 3; i++) {
    if (availableWords.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    selectedWords.push(availableWords[randomIndex]);
    availableWords.splice(randomIndex, 1);
  }
  
  // Create door options (one correct, two incorrect)
  const correctDoorIndex = Math.floor(Math.random() * 3);
  const doors = selectedWords.map((word, index) => {
    if (index === correctDoorIndex) {
      // Correct door
      return {
        english: word.english,
        turkish: word.turkish,
        isCorrect: true
      };
    } else {
      // Incorrect door - use the Turkish translation from another word
      const otherWords = wordPairs[difficulty].filter(
        w => !selectedWords.includes(w) || w.english !== word.english
      );
      
      const randomWrongWord = otherWords[Math.floor(Math.random() * otherWords.length)];
      
      return {
        english: word.english,
        turkish: randomWrongWord.turkish,
        isCorrect: false
      };
    }
  });
  
  return {
    roundNumber,
    wordPairs: selectedWords,
    doors,
    correctDoorIndex
  };
};

// Create the game store
export const useVocabGameStore = create<VocabGameState & VocabGameActions>()(
  persist(
    (set, get) => ({
      difficulty: 'easy',
      currentRound: 0,
      totalRounds: 10,
      score: 0,
      highScore: 0,
      gameStatus: 'idle',
      currentGameRound: null,
      memorizeTimeSeconds: 5,
      choosingTimeSeconds: 10, // Time limit for door selection
      
      // Initialize the game with the selected difficulty
      initializeGame: (difficulty: Difficulty = 'easy', totalRounds: number = 10) => {
        set({
          difficulty,
          currentRound: 0,
          totalRounds,
          score: 0,
          gameStatus: 'memorizing',
          currentGameRound: null,
          memorizeTimeSeconds: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 4 : 3,
          choosingTimeSeconds: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 8 : 6
        });
        
        // Generate the first round
        const nextRound = generateGameRound(difficulty, 1);
        set({ currentGameRound: nextRound });
      },
      
      // Start the next round
      startNextRound: () => {
        const { currentRound, totalRounds, difficulty } = get();
        
        if (currentRound >= totalRounds) {
          // Game is complete
          set({ gameStatus: 'completed' });
          return;
        }
        
        const nextRoundNumber = currentRound + 1;
        const nextRound = generateGameRound(difficulty, nextRoundNumber);
        
        set({
          currentRound: nextRoundNumber,
          currentGameRound: nextRound,
          gameStatus: 'memorizing'
        });
      },
      
      // Transition from memorizing to choosing a door
      finishMemorizing: () => {
        set({ gameStatus: 'choosing' });
      },
      
      // Handle door selection
      selectDoor: (doorIndex: number) => {
        const { currentGameRound, score, highScore } = get();
        
        if (!currentGameRound) return;
        
        const isCorrect = doorIndex === currentGameRound.correctDoorIndex;
        const newScore = isCorrect ? score + 1 : score;
        const newHighScore = newScore > highScore ? newScore : highScore;
        
        set({
          score: newScore,
          highScore: newHighScore,
          gameStatus: isCorrect ? 'correct' : 'incorrect'
        });
      },
      
      // Handle time expiration for door selection
      timeExpired: () => {
        set({
          gameStatus: 'incorrect'
        });
      },
      
      // Reset the game
      resetGame: () => {
        const { difficulty } = get();
        get().initializeGame(difficulty);
      }
    }),
    {
      name: 'vocab-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        difficulty: state.difficulty,
        highScore: state.highScore,
      }),
    }
  )
);