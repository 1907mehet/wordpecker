import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import tr from '@/constants/localization';
import { Zap, Flame, Dumbbell, Check } from 'lucide-react-native';
import { Difficulty } from '@/types/game';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export default function DifficultySelector({ 
  selectedDifficulty, 
  onSelectDifficulty 
}: DifficultySelectorProps) {
  const difficulties: { 
    id: Difficulty; 
    title: string; 
    description: string;
    color: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'easy',
      title: tr.difficulties?.easy || "Kolay",
      description: tr.easyDifficultyDesc || "Yeni başlayanlar için ideal",
      color: '#4CAF50',
      icon: <Zap size={24} color="#4CAF50" />
    },
    {
      id: 'medium',
      title: tr.difficulties?.medium || "Orta",
      description: tr.mediumDifficultyDesc || "Orta seviye öğrenenler için",
      color: '#FF9800',
      icon: <Dumbbell size={24} color="#FF9800" />
    },
    {
      id: 'hard',
      title: tr.difficulties?.hard || "Zor",
      description: tr.hardDifficultyDesc || "Kendini zorla",
      color: '#F44336',
      icon: <Flame size={24} color="#F44336" />
    }
  ];

  return (
    <View style={styles.container}>
      {difficulties.map(difficulty => (
        <TouchableOpacity
          key={difficulty.id}
          style={[
            styles.difficultyCard,
            selectedDifficulty === difficulty.id && [
              styles.selectedCard,
              { borderColor: difficulty.color }
            ]
          ]}
          onPress={() => onSelectDifficulty(difficulty.id)}
          activeOpacity={0.7}
        >
          <View style={styles.difficultyHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${difficulty.color}15` }]}>
              {difficulty.icon}
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.difficultyTitle}>{difficulty.title}</Text>
              {selectedDifficulty === difficulty.id && (
                <View style={[styles.selectedIndicator, { backgroundColor: difficulty.color }]}>
                  <Check size={16} color="white" />
                </View>
              )}
            </View>
          </View>
          <Text style={styles.difficultyDescription}>
            {difficulty.description}
          </Text>
          
          {/* Selection indicator bar */}
          {selectedDifficulty === difficulty.id && (
            <View style={[styles.selectionBar, { backgroundColor: difficulty.color }]} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  difficultyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedCard: {
    borderWidth: 2,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  difficultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  selectedIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    paddingLeft: 64, // Align with title
  },
  selectionBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
});