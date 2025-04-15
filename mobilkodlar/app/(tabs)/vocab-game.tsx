import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import tr from '@/constants/localization';
import Button from '@/components/Button';
import { useVocabGameStore } from '@/store/vocab-game-store';
import DoorOption from '@/components/vocab-game/DoorOption';
import WordMemorizeCard from '@/components/vocab-game/WordMemorizeCard';
import CountdownTimer from '@/components/vocab-game/CountdownTimer';
import { Award, Trophy, ArrowRight, RefreshCw, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function VocabGameScreen() {
  const { 
    difficulty, 
    currentRound, 
    totalRounds, 
    score, 
    highScore,
    gameStatus, 
    currentGameRound,
    memorizeTimeSeconds,
    choosingTimeSeconds,
    initializeGame, 
    startNextRound, 
    finishMemorizing, 
    selectDoor,
    timeExpired,
    resetGame 
  } = useVocabGameStore();

  // Initialize the game if it's in idle state
  useEffect(() => {
    if (gameStatus === 'idle') {
      initializeGame();
    }
  }, [gameStatus, initializeGame]);

  // Render different content based on game status
  const renderContent = () => {
    switch (gameStatus) {
      case 'idle':
        return renderStartScreen();
      case 'memorizing':
        return renderMemorizeScreen();
      case 'choosing':
        return renderChooseScreen();
      case 'correct':
        return renderResultScreen(true);
      case 'incorrect':
        return renderResultScreen(false);
      case 'completed':
        return renderCompletedScreen();
      default:
        return renderStartScreen();
    }
  };

  // Start screen
  const renderStartScreen = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{tr.doorGame}</Text>
      <Text style={styles.description}>
        {tr.memorizeWords} → {tr.chooseDoor}
      </Text>
      
      <View style={styles.difficultyContainer}>
        <Text style={styles.sectionTitle}>{tr.chooseDifficulty}</Text>
        <View style={styles.difficultyOptions}>
          {['easy', 'medium', 'hard'].map((diff) => (
            <Button
              key={diff}
              title={tr.difficulties[diff as keyof typeof tr.difficulties]}
              variant={difficulty === diff ? 'primary' : 'outline'}
              onPress={() => initializeGame(diff as 'easy' | 'medium' | 'hard')}
              style={styles.difficultyButton}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Trophy size={24} color={colors.primary} />
          <Text style={styles.statLabel}>{tr.highScore}</Text>
          <Text style={styles.statValue}>{highScore}</Text>
        </View>
      </View>
      
      <Button
        title={tr.startGame}
        onPress={() => initializeGame(difficulty)}
        style={styles.actionButton}
      />
    </View>
  );

  // Memorize screen
  const renderMemorizeScreen = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.roundText}>
        {tr.roundOf.replace('{0}', currentRound.toString()).replace('{1}', totalRounds.toString())}
      </Text>
      
      <Text style={styles.instructionText}>{tr.memorizeTheseWords}</Text>
      
      <CountdownTimer 
        seconds={memorizeTimeSeconds} 
        onComplete={finishMemorizing} 
      />
      
      <View style={styles.wordsContainer}>
        {currentGameRound?.wordPairs.map((wordPair, index) => (
          <WordMemorizeCard key={index} wordPair={wordPair} />
        ))}
      </View>
    </View>
  );

  // Choose door screen
  const renderChooseScreen = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.roundText}>
        {tr.roundOf.replace('{0}', currentRound.toString()).replace('{1}', totalRounds.toString())}
      </Text>
      
      <Text style={styles.instructionText}>{tr.selectCorrectDoor}</Text>
      
      <View style={styles.timerContainer}>
        <Clock size={20} color={colors.primary} />
        <CountdownTimer 
          seconds={choosingTimeSeconds} 
          onComplete={timeExpired}
          style={styles.choosingTimer}
        />
      </View>
      
      <View style={styles.doorsContainer}>
        {currentGameRound?.doors.map((door, index) => (
          <DoorOption
            key={index}
            english={door.english}
            turkish={door.turkish}
            onSelect={() => selectDoor(index)}
          />
        ))}
      </View>
    </View>
  );

  // Result screen (correct or incorrect)
  const renderResultScreen = (isCorrect: boolean) => (
    <View style={styles.contentContainer}>
      <Text style={[styles.resultText, isCorrect ? styles.correctText : styles.incorrectText]}>
        {isCorrect ? tr.correctDoor : tr.wrongDoor}
      </Text>
      
      <View style={styles.doorsContainer}>
        {currentGameRound?.doors.map((door, index) => (
          <DoorOption
            key={index}
            english={door.english}
            turkish={door.turkish}
            onSelect={() => {}}
            disabled={true}
            isCorrect={door.isCorrect}
            showResult={true}
          />
        ))}
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>
          {tr.score}: {score}
        </Text>
      </View>
      
      <Button
        title={currentRound < totalRounds ? tr.nextRound : tr.seeResults}
        onPress={startNextRound}
        style={styles.actionButton}
        icon={<ArrowRight size={20} color="white" />}
      />
    </View>
  );

  // Completed screen
  const renderCompletedScreen = () => (
    <View style={styles.contentContainer}>
      <Award size={80} color={colors.primary} style={styles.trophyIcon} />
      
      <Text style={styles.completedTitle}>{tr.gameCompleted}</Text>
      <Text style={styles.completedDesc}>{tr.gameCompletedDesc}</Text>
      
      <View style={styles.finalScoreContainer}>
        <Text style={styles.finalScoreLabel}>{tr.finalScore}</Text>
        <Text style={styles.finalScoreValue}>{score}</Text>
        
        {score === highScore && score > 0 && (
          <Text style={styles.newHighScoreText}>{tr.newHighScore}</Text>
        )}
      </View>
      
      <Button
        title={tr.playAgain}
        onPress={resetGame}
        style={styles.actionButton}
        icon={<RefreshCw size={20} color="white" />}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: tr.doorGame }} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
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
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  difficultyContainer: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  difficultyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    minWidth: 120,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  actionButton: {
    width: '100%',
    marginTop: 16,
  },
  roundText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  choosingTimer: {
    marginLeft: 8,
  },
  wordsContainer: {
    width: '100%',
    marginTop: 16,
  },
  doorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  correctText: {
    color: colors.success,
  },
  incorrectText: {
    color: colors.error,
  },
  scoreContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  completedDesc: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  trophyIcon: {
    marginBottom: 24,
  },
  finalScoreContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    width: '80%',
    marginBottom: 32,
  },
  finalScoreLabel: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  finalScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  newHighScoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    marginTop: 8,
  },
});