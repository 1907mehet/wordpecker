import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import tr from '@/constants/localization';
import DifficultySelector from '@/components/game/DifficultySelector';
import GameMap from '@/components/game/GameMap';
import { useGameStore } from '@/store/game-store';
import { Book, Map, ArrowRight, Check } from 'lucide-react-native';
import { Difficulty } from '@/types/game';

export default function GameScreen() {
  const { 
    difficulty, 
    setDifficulty, 
    resetGame, 
    isGameStarted,
    startGame,
    currentLevel,
    gameProgress
  } = useGameStore();
  
  // Local state to track game started status
  const [localGameStarted, setLocalGameStarted] = useState(false);
  
  useEffect(() => {
    // Initialize local state with store state
    setLocalGameStarted(isGameStarted);
    
    console.log("GameScreen mounted, isGameStarted:", isGameStarted);
    
    // If game is started, navigate directly to the first level
    if (isGameStarted && !Object.values(gameProgress).some(Boolean)) {
      router.replace('/game/level/1');
    }
  }, []);

  // Listen for changes to isGameStarted from the store
  useEffect(() => {
    console.log("isGameStarted changed in store:", isGameStarted);
    setLocalGameStarted(isGameStarted);
    
    // If game is started, navigate directly to the first level
    if (isGameStarted && !Object.values(gameProgress).some(Boolean)) {
      router.replace('/game/level/1');
    }
  }, [isGameStarted]);

  const handleStartGame = () => {
    console.log("Starting game...");
    // Call startGame from the store to update the state
    startGame();
    // Navigate directly to the first level
    router.push('/game/level/1');
  };

  const handleLevelSelect = (levelId: number) => {
    console.log("Navigating to level:", levelId);
    router.push(`/game/level/${levelId}`);
  };

  // Get color based on difficulty
  const getDifficultyColor = (diff: Difficulty = difficulty) => {
    switch (diff) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return colors.primary;
    }
  };

  // Debugging output
  console.log("Rendering GameScreen, isGameStarted:", isGameStarted, "localGameStarted:", localGameStarted);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{tr.storyAdventure || "Hikaye Macerası"}</Text>
          <Text style={styles.subtitle}>{tr.learnThroughStories || "Hikayeler ile öğren"}</Text>
        </View>

        {!localGameStarted ? (
          <View style={styles.difficultyContainer}>
            {/* Current Difficulty Indicator */}
            <View style={styles.currentDifficultyContainer}>
              <Text style={styles.currentDifficultyLabel}>{tr.currentDifficulty || "Mevcut Zorluk"}</Text>
              <View style={[styles.currentDifficultyBadge, { backgroundColor: getDifficultyColor() }]}>
                <Text style={styles.currentDifficultyText}>
                  {tr.difficulties?.[difficulty] || (difficulty === 'easy' ? 'Kolay' : difficulty === 'medium' ? 'Orta' : 'Zor')}
                </Text>
                <Check size={16} color="white" />
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>{tr.selectDifficulty || "Zorluk Seç"}</Text>
            <DifficultySelector 
              selectedDifficulty={difficulty}
              onSelectDifficulty={setDifficulty}
            />
            
            {/* START GAME BUTTON - IMPORTANT */}
            <TouchableOpacity 
              style={[styles.startButton, { backgroundColor: getDifficultyColor() }]}
              onPress={handleStartGame}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>{tr.startAdventure || "Maceraya Başla"}</Text>
              <ArrowRight size={20} color="white" style={styles.startButtonIcon} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.mapContainer}>
            <View style={styles.mapHeader}>
              <Text style={styles.sectionTitle}>
                {tr.yourStory || "Hikayen"}
              </Text>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
                <Text style={styles.difficultyBadgeText}>
                  {tr.difficulties?.[difficulty] || (difficulty === 'easy' ? 'Kolay' : difficulty === 'medium' ? 'Orta' : 'Zor')}
                </Text>
              </View>
            </View>
            <GameMap 
              difficulty={difficulty}
              currentLevel={currentLevel}
              gameProgress={gameProgress}
              onLevelSelect={handleLevelSelect}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  difficultyContainer: {
    marginBottom: 30,
  },
  currentDifficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  currentDifficultyLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  currentDifficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  currentDifficultyText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  startButton: {
    marginTop: 24,
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  startButtonIcon: {
    marginLeft: 4,
  },
  mapContainer: {
    marginBottom: 30,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});