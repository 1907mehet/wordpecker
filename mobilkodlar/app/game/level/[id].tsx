import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import tr from '@/constants/localization';
import Button from '@/components/Button';
import { useGameStore } from '@/store/game-store';
import StoryDisplay from '@/components/game/StoryDisplay';
import VocabularyQuiz from '@/components/game/VocabularyQuiz';
import { Book, CheckCircle, XCircle, ArrowRight, Star } from 'lucide-react-native';

export default function LevelScreen() {
  const { id } = useLocalSearchParams();
  const levelId = parseInt(id as string, 10);
  
  const { getLevelData, completeLevel, isLevelCompleted, difficulty } = useGameStore();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  const levelData = getLevelData(levelId);
  
  // Set dynamic header title
  useEffect(() => {
    if (levelData) {
      // This will update the header title
    }
  }, [levelData]);
  
  useEffect(() => {
    // Reset state when level changes
    setShowQuiz(false);
    setQuizCompleted(false);
    setScore(0);
  }, [levelId]);
  
  if (!levelData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{tr.levelNotFound || "Seviye bulunamadı"}</Text>
          <Button 
            title={tr.backToMap || "Haritaya Dön"}
            onPress={() => router.back()}
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const handleContinue = () => {
    setShowQuiz(true);
  };
  
  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setQuizCompleted(true);
    
    // Mark level as completed if score is at least 2 out of 3
    if (finalScore >= 2) {
      completeLevel(levelId);
    }
  };
  
  const handleNextLevel = () => {
    if (levelId < 4) {
      router.replace(`/game/level/${levelId + 1}`);
    } else {
      // If this is the last level, go back to the map
      router.replace('/game');
    }
  };
  
  const handleRetry = () => {
    setShowQuiz(false);
    setQuizCompleted(false);
    setScore(0);
  };
  
  // Get theme color based on difficulty
  const getThemeColor = () => {
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
  
  const themeColor = getThemeColor();
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: `Bölüm ${levelId}`,
          headerStyle: {
            backgroundColor: themeColor,
          },
          headerTintColor: 'white',
        }}
      />
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.levelHeader, { backgroundColor: themeColor }]}>
          <Text style={styles.title}>{`Bölüm ${levelId}`}</Text>
          <View style={styles.levelIndicatorContainer}>
            <Text style={styles.levelIndicator}>
              {levelId} / 4
            </Text>
            <View style={styles.levelDots}>
              {[1, 2, 3, 4].map(dot => (
                <View 
                  key={`dot-${dot}`} 
                  style={[
                    styles.levelDot, 
                    dot === levelId && styles.activeLevelDot,
                    { borderColor: 'white' }
                  ]} 
                />
              ))}
            </View>
          </View>
        </View>
        
        {!showQuiz ? (
          // Story view
          <View style={styles.storyContainer}>
            <View style={styles.storyCard}>
              <View style={styles.storyCardHeader}>
                <Book size={20} color={themeColor} />
                <Text style={[styles.storyCardTitle, { color: themeColor }]}>{tr.readTheStory || "Hikayeyi Oku"}</Text>
              </View>
              <StoryDisplay 
                story={levelData.story}
                vocabularyWords={levelData.vocabularyWords}
                themeColor={themeColor}
              />
              <Button 
                title={tr.continue || "Devam Et"}
                onPress={handleContinue}
                style={[styles.button, { backgroundColor: themeColor }]}
                icon={<ArrowRight size={20} color="white" />}
              />
            </View>
          </View>
        ) : !quizCompleted ? (
          // Quiz view
          <View style={styles.quizContainer}>
            <View style={styles.quizCard}>
              <View style={styles.quizCardHeader}>
                <Text style={[styles.quizTitle, { color: themeColor }]}>{tr.testYourKnowledge || "Bilgini Test Et"}</Text>
                <Text style={styles.quizSubtitle}>{tr.selectCorrectTranslations || "Doğru çeviriyi seç"}</Text>
              </View>
              <VocabularyQuiz 
                questions={levelData.questions}
                onComplete={handleQuizComplete}
                themeColor={themeColor}
              />
            </View>
          </View>
        ) : (
          // Results view
          <View style={styles.resultsContainer}>
            <View style={[styles.resultsCard, score >= 2 ? styles.successCard : styles.failCard]}>
              <View style={styles.resultIconContainer}>
                {score >= 2 ? (
                  <CheckCircle size={60} color="#4CAF50" />
                ) : (
                  <XCircle size={60} color="#F44336" />
                )}
              </View>
              <Text style={styles.resultsTitle}>
                {score >= 2 ? (tr.levelCompleted || "Seviye Tamamlandı!") : (tr.tryAgain || "Tekrar Dene")}
              </Text>
              
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  {tr.yourScore || "Puanınız"}: {score}/3
                </Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3].map(star => (
                    <Star 
                      key={`star-${star}`} 
                      size={30} 
                      color={star <= score ? "#FFD700" : "#E0E0E0"} 
                      fill={star <= score ? "#FFD700" : "none"} 
                    />
                  ))}
                </View>
              </View>
              
              {score >= 2 ? (
                <View style={styles.buttonsContainer}>
                  <Button 
                    title={levelId < 4 ? (tr.nextChapter || "Sonraki Bölüm") : (tr.finishStory || "Hikayeyi Bitir")}
                    onPress={handleNextLevel}
                    style={[styles.button, { backgroundColor: themeColor }]}
                  />
                  <TouchableOpacity 
                    onPress={() => router.replace('/game')}
                    style={styles.textButton}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.textButtonText, { color: themeColor }]}>{tr.backToMap || "Haritaya Dön"}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.buttonsContainer}>
                  <Button 
                    title={tr.tryAgain || "Tekrar Dene"}
                    onPress={handleRetry}
                    style={[styles.button, { backgroundColor: themeColor }]}
                  />
                  <TouchableOpacity 
                    onPress={() => router.replace('/game')}
                    style={styles.textButton}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.textButtonText, { color: themeColor }]}>{tr.backToMap || "Haritaya Dön"}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  levelHeader: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  levelIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelIndicator: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  levelDots: {
    flexDirection: 'row',
  },
  levelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 3,
    backgroundColor: 'transparent',
  },
  activeLevelDot: {
    backgroundColor: 'white',
  },
  storyContainer: {
    paddingHorizontal: 20,
  },
  storyCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  storyCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  quizContainer: {
    paddingHorizontal: 20,
  },
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizCardHeader: {
    marginBottom: 16,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  quizSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successCard: {
    borderTopWidth: 5,
    borderTopColor: '#4CAF50',
  },
  failCard: {
    borderTopWidth: 5,
    borderTopColor: '#F44336',
  },
  resultIconContainer: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    marginTop: 24,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  textButton: {
    marginTop: 16,
    padding: 8,
  },
  textButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
});