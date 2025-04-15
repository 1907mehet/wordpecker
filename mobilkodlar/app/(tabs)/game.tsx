import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import tr from '@/constants/localization';
import { Book, Map, Zap, Flame, Dumbbell, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '@/store/game-store';
import { Difficulty } from '@/types/game';

export default function GameTab() {
  const { difficulty, setDifficulty, resetGame, startGame } = useGameStore();

  const handleNavigateToGame = (selectedDifficulty: Difficulty = difficulty) => {
    console.log("Navigating to game level with difficulty:", selectedDifficulty);
    
    // Set the difficulty in the store
    setDifficulty(selectedDifficulty);
    
    // Reset game state to ensure a fresh start
    resetGame();
    
    // Start the game
    startGame();
    
    // Navigate directly to the first level
    router.push('/game/level/1');
  };

  // Get color based on difficulty
  const getDifficultyColor = () => {
    switch (difficulty) {
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

  // Get icon based on difficulty
  const getDifficultyIcon = () => {
    switch (difficulty) {
      case 'easy':
        return <Zap size={20} color="white" />;
      case 'medium':
        return <Dumbbell size={20} color="white" />;
      case 'hard':
        return <Flame size={20} color="white" />;
      default:
        return <Map size={20} color="white" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{tr.storyAdventure || "Story Adventure"}</Text>
          <Text style={styles.subtitle}>{tr.learnThroughStories || "Learn through stories"}</Text>
        </View>

        {/* Current Difficulty Indicator */}
        <View style={styles.currentDifficultyContainer}>
          <Text style={styles.currentDifficultyLabel}>{tr.currentDifficulty || "Current Difficulty"}</Text>
          <View style={[styles.currentDifficultyBadge, { backgroundColor: getDifficultyColor() }]}>
            <Text style={styles.currentDifficultyText}>
              {tr.difficulties?.[difficulty] || difficulty}
            </Text>
            {getDifficultyIcon()}
          </View>
        </View>

        {/* Featured Story Card */}
        <TouchableOpacity 
          style={[styles.featuredCard, { backgroundColor: getDifficultyColor() }]}
          onPress={() => handleNavigateToGame(difficulty)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
            style={styles.cardGradient}
          />
          <View style={styles.cardContent}>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>{tr.featured || "Featured"}</Text>
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{tr.storyAdventure || "Story Adventure"}</Text>
              <Text style={styles.cardDescription}>{tr.learnThroughStories || "Learn through stories"}</Text>
              <View style={styles.cardButton}>
                <Text style={styles.cardButtonText}>{tr.play || "Play"}</Text>
                {getDifficultyIcon()}
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Difficulty Levels */}
        <View style={styles.difficultySection}>
          <Text style={styles.sectionTitle}>{tr.chooseDifficulty || "Choose Difficulty"}</Text>
          <View style={styles.difficultyCards}>
            {/* Easy */}
            <TouchableOpacity 
              style={[
                styles.difficultyCard,
                difficulty === 'easy' && styles.selectedDifficultyCard,
                difficulty === 'easy' && { borderColor: '#4CAF50' }
              ]}
              onPress={() => setDifficulty('easy')}
              activeOpacity={0.7}
            >
              <View style={[styles.difficultyIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Zap size={24} color="#4CAF50" />
              </View>
              <View style={styles.difficultyContent}>
                <Text style={styles.difficultyTitle}>{tr.difficulties?.easy || "Easy"}</Text>
                <Text style={styles.difficultyDescription}>{tr.easyDifficultyDesc || "Perfect for beginners"}</Text>
                {difficulty === 'easy' && (
                  <View style={[styles.selectedIndicator, { backgroundColor: '#4CAF50' }]}>
                    <Text style={styles.selectedIndicatorText}>{tr.selected || "Selected"}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* Medium */}
            <TouchableOpacity 
              style={[
                styles.difficultyCard,
                difficulty === 'medium' && styles.selectedDifficultyCard,
                difficulty === 'medium' && { borderColor: '#FF9800' }
              ]}
              onPress={() => setDifficulty('medium')}
              activeOpacity={0.7}
            >
              <View style={[styles.difficultyIcon, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                <Dumbbell size={24} color="#FF9800" />
              </View>
              <View style={styles.difficultyContent}>
                <Text style={styles.difficultyTitle}>{tr.difficulties?.medium || "Medium"}</Text>
                <Text style={styles.difficultyDescription}>{tr.mediumDifficultyDesc || "For intermediate learners"}</Text>
                {difficulty === 'medium' && (
                  <View style={[styles.selectedIndicator, { backgroundColor: '#FF9800' }]}>
                    <Text style={styles.selectedIndicatorText}>{tr.selected || "Selected"}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* Hard */}
            <TouchableOpacity 
              style={[
                styles.difficultyCard,
                difficulty === 'hard' && styles.selectedDifficultyCard,
                difficulty === 'hard' && { borderColor: '#F44336' }
              ]}
              onPress={() => setDifficulty('hard')}
              activeOpacity={0.7}
            >
              <View style={[styles.difficultyIcon, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
                <Flame size={24} color="#F44336" />
              </View>
              <View style={styles.difficultyContent}>
                <Text style={styles.difficultyTitle}>{tr.difficulties?.hard || "Hard"}</Text>
                <Text style={styles.difficultyDescription}>{tr.hardDifficultyDesc || "Challenge yourself"}</Text>
                {difficulty === 'hard' && (
                  <View style={[styles.selectedIndicator, { backgroundColor: '#F44336' }]}>
                    <Text style={styles.selectedIndicatorText}>{tr.selected || "Selected"}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Play Button - IMPORTANT */}
        <TouchableOpacity 
          style={[styles.playButton, { backgroundColor: getDifficultyColor() }]}
          onPress={() => handleNavigateToGame(difficulty)}
          activeOpacity={0.8}
        >
          <Text style={styles.playButtonText}>{tr.playNow || "PLAY NOW"}</Text>
          <ArrowRight size={20} color="white" style={styles.playButtonIcon} />
        </TouchableOpacity>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  currentDifficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  featuredCard: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  cardContent: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  cardBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  cardTextContainer: {
    justifyContent: 'flex-end',
  },
  cardTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 16,
  },
  cardButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
  cardButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  difficultySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  difficultyCards: {
    flexDirection: 'column',
    gap: 12,
  },
  difficultyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedDifficultyCard: {
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  difficultyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  difficultyContent: {
    flex: 1,
  },
  difficultyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  difficultyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  selectedIndicator: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  selectedIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  playButton: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    height: 60,
  },
  playButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  playButtonIcon: {
    marginLeft: 4,
  }
});