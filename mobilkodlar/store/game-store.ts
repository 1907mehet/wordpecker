import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty, GameLevel, GameState, GameActions } from '@/types/game';

// Story segments for each level and difficulty
const storySegments = {
  easy: [
    `It was a beautiful summer day and Ali had just arrived in a coastal town. As the salty sea breeze filled the air, Ali was walking along the beach. While exploring the shore, he found a mysterious map partially buried in the sand. This map seemed to point to a hidden treasure somewhere nearby.`,
    
    `The next morning, Ali decided to follow the clues on the map. It led him to an ancient lighthouse rising on rocky slopes. The structure was old but still looked magnificent against the blue sky. As Ali approached, it was clear that this lighthouse held more secrets than expected.`,
    
    `The journey through the lighthouse revealed a series of secret rooms. Each room contained a clue that Ali carefully collected. With each discovery, the excitement grew, making the quest even more interesting. By sunset, all the clues needed to proceed had been gathered.`,
    
    `Following the final clues, Ali descended to a hidden chamber beneath the lighthouse. There, a treasure chest stood concealed behind an ancient stone wall. The adventure had been challenging, but Ali was proud to have completed the mission. Inside the chest was not gold, but something much more valuable: a collection of historical artifacts telling the story of the town's founders.`
  ],
  
  medium: [
    `Mert returned to a bustling metropolis after many years. What drew him back was a letter containing encrypted journal entries. The pages were filled with references to family secrets and a mysterious past. The crowded streets and tall buildings of the metropolitan area had changed, but the family mystery remained unsolved.`,
    
    `Determined to decode the encrypted messages in the journal, Mert began investigating. The clues led to an old family home where a forgotten family heirloom was said to be hidden. The search through dusty attics and sealed rooms revealed clues about the family's legacy and significance.`,
    
    `As Mert continued to decipher the journal entries, each revelation brought new questions about the family's ancestry. Old photographs, letters, and documents painted a picture of a complex family history filled with both triumph and tragedy. The pieces of the puzzle slowly began to come together.`,
    
    `In the final pages of the journal, Mert discovered the location of the family heirloom: a hidden safe behind a portrait in the library. Inside was not only the precious heirloom but also documents reconciling conflicting accounts of the family history. With this legacy uncovered, Mert found closure and a new understanding of his identity.`
  ],
  
  hard: [
    `Dr. Taner arrived at a remote research station in Antarctica to investigate a strange phenomenon detected by satellite. The team's expedition had been planned for months, but nothing could prepare them for what they would find. Despite the extreme weather conditions, they set up their equipment and began monitoring the signals.`,
    
    `The data revealed an anomaly that had never been recorded before. Dr. Taner developed a hypothesis and suggested that the signals might be coming from beneath the ice. The team faced unprecedented challenges as they prepared to drill through the thick Antarctic ice sheet to investigate further.`,
    
    `After days of careful work, the team drilled through to discover a hidden facility in the depths of the ice. The excavation revealed a research station abandoned decades ago. Each revelation brought more questions about what kind of experiments were conducted there and why it was abandoned in such haste.`,
    
    `In the lowest level of the facility, Dr. Taner made a breakthrough discovery: evidence of advanced technology that had been developed and then hidden from the world. The implications of this finding would forever change scientific paradigms. As they documented everything, the team realized they had discovered something that would rewrite the history books.`
  ]
};

// Function to generate a continuous story based on difficulty
const generateStory = (difficulty: Difficulty): GameLevel[] => {
  // Base story elements that will be expanded based on difficulty
  const storyThemes = {
    easy: {
      setting: "a coastal town",
      character: "Ali",
      goal: "find a hidden treasure",
      obstacle: "mysterious map",
      resolution: "ancient lighthouse"
    },
    medium: {
      setting: "a bustling metropolis",
      character: "Mert",
      goal: "solve an old family mystery",
      obstacle: "encrypted journal entries",
      resolution: "forgotten family heirloom"
    },
    hard: {
      setting: "a remote research station in Antarctica",
      character: "Dr. Taner",
      goal: "discover the source of strange signals",
      obstacle: "extreme weather conditions",
      resolution: "abandoned underground facility"
    }
  };

  const theme = storyThemes[difficulty];
  
  // Vocabulary words with definitions and translations - THREE WORDS PER LEVEL
  const vocabularySets = {
    easy: [
      // Level 1 - three words
      [
        { word: "treasure", definition: "a quantity of precious metals, gems, or other valuable objects", translation: "hazine" },
        { word: "mysterious", definition: "difficult or impossible to understand, explain, or identify", translation: "gizemli" },
        { word: "coastal", definition: "of or relating to a coast", translation: "kıyısal" }
      ],
      // Level 2 - three words
      [
        { word: "ancient", definition: "belonging to the very distant past and no longer in existence", translation: "antik" },
        { word: "lighthouse", definition: "a tower or other structure with a powerful light designed to guide ships", translation: "deniz feneri" },
        { word: "magnificent", definition: "extremely beautiful and impressive", translation: "muhteşem" }
      ],
      // Level 3 - three words
      [
        { word: "excitement", definition: "a feeling of great enthusiasm and eagerness", translation: "heyecan" },
        { word: "discovery", definition: "the action or process of finding something that was previously unknown", translation: "keşif" },
        { word: "journey", definition: "an act of traveling from one place to another", translation: "yolculuk" }
      ],
      // Level 4 - three words
      [
        { word: "adventure", definition: "an unusual and exciting, typically hazardous, experience or activity", translation: "macera" },
        { word: "concealed", definition: "kept secret; hidden from sight", translation: "gizli" },
        { word: "historical", definition: "of or concerning history or past events", translation: "tarihsel" }
      ]
    ],
    medium: [
      // Level 1 - three words
      [
        { word: "encrypted", definition: "converted information into a coded form to prevent unauthorized access", translation: "şifreli" },
        { word: "metropolis", definition: "a very large and busy city", translation: "metropol" },
        { word: "mysterious", definition: "difficult or impossible to understand, explain, or identify", translation: "gizemli" }
      ],
      // Level 2 - three words
      [
        { word: "heirloom", definition: "a valuable object that has belonged to a family for several generations", translation: "aile yadigarı" },
        { word: "decode", definition: "convert a coded message into intelligible language", translation: "şifre çözmek" },
        { word: "legacy", definition: "something left or handed down by a predecessor", translation: "miras" }
      ],
      // Level 3 - three words
      [
        { word: "ancestry", definition: "one's family or ethnic descent", translation: "soy" },
        { word: "revelation", definition: "a surprising and previously unknown fact that has been disclosed", translation: "ifşaat" },
        { word: "decipher", definition: "succeed in understanding, interpreting, or identifying", translation: "çözmek" }
      ],
      // Level 4 - three words
      [
        { word: "identity", definition: "the fact of being who or what a person or thing is", translation: "kimlik" },
        { word: "reconciling", definition: "making one view or belief compatible with another", translation: "uzlaştırma" },
        { word: "closure", definition: "a feeling that an emotional or traumatic experience has been resolved", translation: "kapanış" }
      ]
    ],
    hard: [
      // Level 1 - three words
      [
        { word: "phenomenon", definition: "a fact or situation that is observed to exist or happen, especially one whose cause or explanation is in question", translation: "fenomen" },
        { word: "expedition", definition: "a journey undertaken by a group of people with a particular purpose", translation: "sefer" },
        { word: "satellite", definition: "an artificial body placed in orbit around the earth or moon or another planet", translation: "uydu" }
      ],
      // Level 2 - three words
      [
        { word: "unprecedented", definition: "never done or known before", translation: "emsalsiz" },
        { word: "anomaly", definition: "something that deviates from what is standard, normal, or expected", translation: "anomali" },
        { word: "hypothesis", definition: "a supposition or proposed explanation made on the basis of limited evidence", translation: "hipotez" }
      ],
      // Level 3 - three words
      [
        { word: "excavation", definition: "the action of excavating something, especially an archaeological site", translation: "kazı" },
        { word: "abandoned", definition: "having been deserted or left", translation: "terk edilmiş" },
        { word: "facility", definition: "a place, amenity, or piece of equipment provided for a particular purpose", translation: "tesis" }
      ],
      // Level 4 - three words
      [
        { word: "breakthrough", definition: "a sudden, dramatic, and important discovery or development", translation: "atılım" },
        { word: "implications", definition: "the conclusion that can be drawn from something although it is not explicitly stated", translation: "çıkarımlar" },
        { word: "paradigms", definition: "a typical example or pattern of something; a model", translation: "paradigmalar" }
      ]
    ]
  };

  // Generate questions for each vocabulary word
  const generateQuestions = (vocabWords: any[], level: number, difficulty: Difficulty) => {
    return vocabWords.map(word => {
      // Generate wrong options based on difficulty
      const generateWrongOptions = () => {
        // All possible translations from all difficulties and levels
        const allTranslations = [
          "hazine", "gizemli", "kıyısal", "antik", "deniz feneri", "muhteşem", 
          "heyecan", "keşif", "yolculuk", "macera", "gizli", "tarihsel", // easy
          "şifreli", "metropol", "gizemli", "aile yadigarı", "şifre çözmek", "miras", 
          "soy", "ifşaat", "çözmek", "kimlik", "uzlaştırma", "kapanış", // medium
          "fenomen", "sefer", "uydu", "emsalsiz", "anomali", "hipotez", 
          "kazı", "terk edilmiş", "tesis", "atılım", "çıkarımlar", "paradigmalar" // hard
        ];
        
        // Filter out the correct answer
        const wrongOptions = allTranslations
          .filter(t => t !== word.translation)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        return wrongOptions;
      };

      const wrongOptions = generateWrongOptions();
      const options = [...wrongOptions, word.translation].sort(() => 0.5 - Math.random());

      return {
        word: word.word,
        options,
        correctAnswer: word.translation
      };
    });
  };

  // Create the four levels with the continuous story
  return [1, 2, 3, 4].map(levelId => {
    const vocabWords = vocabularySets[difficulty][levelId - 1];
    const storySegment = storySegments[difficulty][levelId - 1];
    
    return {
      id: levelId,
      title: `Chapter ${levelId}`,
      story: storySegment,
      vocabularyWords: vocabWords,
      questions: generateQuestions(vocabWords, levelId, difficulty)
    };
  });
};

// Initial game levels for each difficulty
const initialGameLevels: Record<Difficulty, GameLevel[]> = {
  easy: generateStory('easy'),
  medium: generateStory('medium'),
  hard: generateStory('hard')
};

// Free API for generating stories (using a mock implementation)
const generateAIStoryFromFreeAPI = async (difficulty: Difficulty): Promise<GameLevel[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use the Quotable API to get random quotes for our story
    const response = await fetch('https://api.quotable.io/quotes/random?limit=4');
    
    if (!response.ok) {
      throw new Error('Failed to fetch quotes');
    }
    
    const quotes = await response.json();
    
    // Base story elements that will be expanded based on difficulty
    const storyThemes = {
      easy: {
        setting: "a coastal town",
        character: "Ali",
        goal: "find a hidden treasure",
        obstacle: "mysterious map",
        resolution: "ancient lighthouse"
      },
      medium: {
        setting: "a bustling metropolis",
        character: "Mert",
        goal: "solve an old family mystery",
        obstacle: "encrypted journal entries",
        resolution: "forgotten family heirloom"
      },
      hard: {
        setting: "a remote research station in Antarctica",
        character: "Dr. Taner",
        goal: "discover the source of strange signals",
        obstacle: "extreme weather conditions",
        resolution: "abandoned underground facility"
      }
    };

    const theme = storyThemes[difficulty];
    
    // Vocabulary words with definitions and translations - THREE WORDS PER LEVEL
    const vocabularySets = {
      easy: [
        // Level 1 - three words
        [
          { word: "treasure", definition: "a quantity of precious metals, gems, or other valuable objects", translation: "hazine" },
          { word: "mysterious", definition: "difficult or impossible to understand, explain, or identify", translation: "gizemli" },
          { word: "coastal", definition: "of or relating to a coast", translation: "kıyısal" }
        ],
        // Level 2 - three words
        [
          { word: "ancient", definition: "belonging to the very distant past and no longer in existence", translation: "antik" },
          { word: "lighthouse", definition: "a tower or other structure with a powerful light designed to guide ships", translation: "deniz feneri" },
          { word: "magnificent", definition: "extremely beautiful and impressive", translation: "muhteşem" }
        ],
        // Level 3 - three words
        [
          { word: "excitement", definition: "a feeling of great enthusiasm and eagerness", translation: "heyecan" },
          { word: "discovery", definition: "the action or process of finding something that was previously unknown", translation: "keşif" },
          { word: "journey", definition: "an act of traveling from one place to another", translation: "yolculuk" }
        ],
        // Level 4 - three words
        [
          { word: "adventure", definition: "an unusual and exciting, typically hazardous, experience or activity", translation: "macera" },
          { word: "concealed", definition: "kept secret; hidden from sight", translation: "gizli" },
          { word: "historical", definition: "of or concerning history or past events", translation: "tarihsel" }
        ]
      ],
      medium: [
        // Level 1 - three words
        [
          { word: "encrypted", definition: "converted information into a coded form to prevent unauthorized access", translation: "şifreli" },
          { word: "metropolis", definition: "a very large and busy city", translation: "metropol" },
          { word: "mysterious", definition: "difficult or impossible to understand, explain, or identify", translation: "gizemli" }
        ],
        // Level 2 - three words
        [
          { word: "heirloom", definition: "a valuable object that has belonged to a family for several generations", translation: "aile yadigarı" },
          { word: "decode", definition: "convert a coded message into intelligible language", translation: "şifre çözmek" },
          { word: "legacy", definition: "something left or handed down by a predecessor", translation: "miras" }
        ],
        // Level 3 - three words
        [
          { word: "ancestry", definition: "one's family or ethnic descent", translation: "soy" },
          { word: "revelation", definition: "a surprising and previously unknown fact that has been disclosed", translation: "ifşaat" },
          { word: "decipher", definition: "succeed in understanding, interpreting, or identifying", translation: "çözmek" }
        ],
        // Level 4 - three words
        [
          { word: "identity", definition: "the fact of being who or what a person or thing is", translation: "kimlik" },
          { word: "reconciling", definition: "making one view or belief compatible with another", translation: "uzlaştırma" },
          { word: "closure", definition: "a feeling that an emotional or traumatic experience has been resolved", translation: "kapanış" }
        ]
      ],
      hard: [
        // Level 1 - three words
        [
          { word: "phenomenon", definition: "a fact or situation that is observed to exist or happen, especially one whose cause or explanation is in question", translation: "fenomen" },
          { word: "expedition", definition: "a journey undertaken by a group of people with a particular purpose", translation: "sefer" },
          { word: "satellite", definition: "an artificial body placed in orbit around the earth or moon or another planet", translation: "uydu" }
        ],
        // Level 2 - three words
        [
          { word: "unprecedented", definition: "never done or known before", translation: "emsalsiz" },
          { word: "anomaly", definition: "something that deviates from what is standard, normal, or expected", translation: "anomali" },
          { word: "hypothesis", definition: "a supposition or proposed explanation made on the basis of limited evidence", translation: "hipotez" }
        ],
        // Level 3 - three words
        [
          { word: "excavation", definition: "the action of excavating something, especially an archaeological site", translation: "kazı" },
          { word: "abandoned", definition: "having been deserted or left", translation: "terk edilmiş" },
          { word: "facility", definition: "a place, amenity, or piece of equipment provided for a particular purpose", translation: "tesis" }
        ],
        // Level 4 - three words
        [
          { word: "breakthrough", definition: "a sudden, dramatic, and important discovery or development", translation: "atılım" },
          { word: "implications", definition: "the conclusion that can be drawn from something although it is not explicitly stated", translation: "çıkarımlar" },
          { word: "paradigms", definition: "a typical example or pattern of something; a model", translation: "paradigmalar" }
        ]
      ]
    };
    
    // Create new story segments using the quotes
    const newStorySegments = quotes.map((quote: any, index: number) => {
      // Get the base story segment
      const baseSegment = storySegments[difficulty][index];
      
      // Incorporate the quote into the story
      return `${baseSegment} ${theme.character} thought: "${quote.content}" - ${quote.author}`;
    });
    
    // Generate questions for each vocabulary word
    const generateQuestions = (vocabWords: any[], level: number, difficulty: Difficulty) => {
      return vocabWords.map(word => {
        // Generate wrong options based on difficulty
        const generateWrongOptions = () => {
          // All possible translations from all difficulties and levels
          const allTranslations = [
            "hazine", "gizemli", "kıyısal", "antik", "deniz feneri", "muhteşem", 
            "heyecan", "keşif", "yolculuk", "macera", "gizli", "tarihsel", // easy
            "şifreli", "metropol", "gizemli", "aile yadigarı", "şifre çözmek", "miras", 
            "soy", "ifşaat", "çözmek", "kimlik", "uzlaştırma", "kapanış", // medium
            "fenomen", "sefer", "uydu", "emsalsiz", "anomali", "hipotez", 
            "kazı", "terk edilmiş", "tesis", "atılım", "çıkarımlar", "paradigmalar" // hard
          ];
          
          // Filter out the correct answer
          const wrongOptions = allTranslations
            .filter(t => t !== word.translation)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          
          return wrongOptions;
        };
  
        const wrongOptions = generateWrongOptions();
        const options = [...wrongOptions, word.translation].sort(() => 0.5 - Math.random());
  
        return {
          word: word.word,
          options,
          correctAnswer: word.translation
        };
      });
    };
    
    // Create the four levels with the new story
    return [1, 2, 3, 4].map(levelId => {
      const vocabWords = vocabularySets[difficulty][levelId - 1];
      const storySegment = newStorySegments[levelId - 1] || storySegments[difficulty][levelId - 1];
      
      return {
        id: levelId,
        title: `Chapter ${levelId}`,
        story: storySegment,
        vocabularyWords: vocabWords,
        questions: generateQuestions(vocabWords, levelId, difficulty)
      };
    });
    
  } catch (error) {
    console.error("Error fetching from free API:", error);
    // Fallback to predefined stories if API fails
    return generateStory(difficulty);
  }
};

// Create the game store with state management functions
export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      difficulty: 'easy',
      isGameStarted: false,
      currentLevel: 1,
      gameProgress: { 1: false, 2: false, 3: false, 4: false },
      isLoading: false,
      error: null,
      gameLevels: initialGameLevels,
      
      setDifficulty: (difficulty) => {
        set({ difficulty });
        console.log("Difficulty set to:", difficulty);
      },
      
      startGame: () => {
        // Explicitly set isGameStarted to true to show the game map
        set({ isGameStarted: true });
        console.log("Game started in store, isGameStarted set to true");
      },
      
      resetGame: () => {
        // Clear any persisted state to start fresh
        set({ 
          isGameStarted: false,
          currentLevel: 1,
          gameProgress: { 1: false, 2: false, 3: false, 4: false }
        });
        console.log("Game reset");
      },
      
      completeLevel: (levelId) => {
        set(state => {
          const newProgress = { ...state.gameProgress };
          newProgress[levelId] = true;
          
          // Update current level to next uncompleted level
          let nextLevel = levelId + 1;
          if (nextLevel > 4) nextLevel = 4;
          
          return { 
            gameProgress: newProgress,
            currentLevel: nextLevel
          };
        });
        console.log(`Level ${levelId} completed`);
      },
      
      isLevelCompleted: (levelId) => {
        return get().gameProgress[levelId] === true;
      },
      
      getLevelData: (levelId) => {
        const { difficulty, gameLevels } = get();
        const levels = gameLevels[difficulty];
        return levels.find(level => level.id === levelId) || null;
      },
      
      // Function to generate stories using free API
      generateAIStory: async (difficulty) => {
        set({ isLoading: true, error: null });
        console.log("Generating AI story for difficulty:", difficulty);
        
        try {
          // Use our free API implementation
          const aiGeneratedLevels = await generateAIStoryFromFreeAPI(difficulty);
          
          set({ 
            isLoading: false,
            gameLevels: { ...get().gameLevels, [difficulty]: aiGeneratedLevels }
          });
          console.log("AI story generated successfully");
          
        } catch (error) {
          console.error("Error generating AI story:", error);
          set({ 
            isLoading: false, 
            error: "An error occurred while generating the story. Please try again."
          });
        }
      }
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these specific keys to avoid issues
      partialize: (state) => ({
        difficulty: state.difficulty,
        gameProgress: state.gameProgress,
        currentLevel: state.currentLevel,
        // Explicitly don't persist isGameStarted to avoid stale state
      }),
    }
  )
);