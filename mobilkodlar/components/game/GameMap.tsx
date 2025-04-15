import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { colors } from '@/constants/colors';
import tr from '@/constants/localization';
import { Check, Lock, Star, ArrowRight } from 'lucide-react-native';
import { Difficulty } from '@/types/game';

interface GameMapProps {
  difficulty: Difficulty;
  currentLevel: number;
  gameProgress: Record<number, boolean>;
  onLevelSelect: (levelId: number) => void;
}

export default function GameMap({ 
  difficulty, 
  currentLevel, 
  gameProgress, 
  onLevelSelect 
}: GameMapProps) {
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

  const difficultyColor = getDifficultyColor();
  
  // Generate levels (4 levels for each difficulty)
  const levels = [1, 2, 3, 4].map(levelId => {
    const isCompleted = gameProgress[levelId];
    const isLocked = levelId > 1 && !gameProgress[levelId - 1] && !isCompleted;
    const isCurrent = levelId === currentLevel;
    
    return {
      id: levelId,
      title: `Bölüm ${levelId}`,
      isCompleted,
      isLocked,
      isCurrent
    };
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        {/* Candy Crush style level map */}
        <View style={styles.levelPath}>
          {levels.map((level, index) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelNode,
                level.isCompleted && [styles.completedNode, { backgroundColor: difficultyColor }],
                level.isCurrent && [styles.currentNode, { borderColor: difficultyColor }],
                level.isLocked && styles.lockedNode
              ]}
              onPress={() => !level.isLocked && onLevelSelect(level.id)}
              disabled={level.isLocked}
              activeOpacity={level.isLocked ? 1 : 0.7}
            >
              {level.isCompleted ? (
                <View style={styles.completedNodeContent}>
                  <Text style={styles.levelNumberCompleted}>{level.id}</Text>
                  <View style={styles.starsContainer}>
                    <Star size={12} color="white" fill="white" />
                    <Star size={12} color="white" fill="white" />
                    <Star size={12} color="white" fill="white" />
                  </View>
                </View>
              ) : level.isLocked ? (
                <Lock size={24} color={colors.placeholder} />
              ) : (
                <Text style={[
                  styles.levelNumber,
                  level.isCurrent && { color: difficultyColor }
                ]}>
                  {level.id}
                </Text>
              )}
              
              <Text style={[
                styles.levelTitle,
                level.isCompleted && styles.levelTitleCompleted,
                level.isLocked && styles.levelTitleLocked,
                level.isCurrent && { color: difficultyColor }
              ]}>
                {level.title}
              </Text>
              
              {level.isCurrent && !level.isLocked && (
                <View style={[styles.currentIndicator, { borderColor: difficultyColor }]}>
                  <Text style={[styles.currentIndicatorText, { color: difficultyColor }]}>
                    {tr.current || "Mevcut"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
          
          {/* Path connections between nodes */}
          <View style={styles.pathConnections}>
            {[0, 1, 2].map((index) => (
              <View 
                key={`path-${index}`}
                style={[
                  styles.pathLine,
                  gameProgress[index + 1] && { backgroundColor: difficultyColor }
                ]} 
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    padding: 20,
  },
  levelPath: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 20,
  },
  pathConnections: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  pathLine: {
    position: 'absolute',
    width: '70%',
    height: 6,
    backgroundColor: '#E0E0E0',
    left: '15%',
    borderRadius: 3,
  },
  levelNode: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    borderWidth: 3,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
  },
  completedNode: {
    borderColor: 'transparent',
  },
  currentNode: {
    borderWidth: 3,
    backgroundColor: 'white',
  },
  lockedNode: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  completedNodeContent: {
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  levelNumberCompleted: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 2,
  },
  levelTitle: {
    position: 'absolute',
    bottom: -30,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  levelTitleCompleted: {
    color: colors.success,
  },
  levelTitleLocked: {
    color: colors.placeholder,
  },
  currentIndicator: {
    position: 'absolute',
    top: -20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  currentIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
  },
});