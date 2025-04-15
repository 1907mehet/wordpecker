import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import tr from '@/constants/localization';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react-native';

interface Question {
  word: string;
  options: string[];
  correctAnswer: string;
}

interface VocabularyQuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
  themeColor: string;
}

export default function VocabularyQuiz({ 
  questions, 
  onComplete,
  themeColor
}: VocabularyQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // Reset state when questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
  }, [questions]);
  
  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    if (option === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz completed
      onComplete(score);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                backgroundColor: themeColor
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionLabel}>{tr.translateWord || "Bu kelimeyi çevir"}:</Text>
        <Text style={[styles.questionWord, { color: themeColor }]}>{currentQuestion.word}</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={`${option}-${index}`}
            style={[
              styles.optionButton,
              selectedOption === option && [
                styles.selectedOption,
                { 
                  backgroundColor: isAnswered ? 
                    (option === currentQuestion.correctAnswer ? '#E8F5E9' : '#FFEBEE') : 
                    `${themeColor}15`
                }
              ]
            ]}
            onPress={() => handleSelectOption(option)}
            disabled={isAnswered}
            activeOpacity={isAnswered ? 1 : 0.7}
          >
            <Text 
              style={[
                styles.optionText,
                selectedOption === option && { 
                  color: isAnswered ? 
                    (option === currentQuestion.correctAnswer ? '#4CAF50' : '#F44336') : 
                    themeColor,
                  fontWeight: '600'
                }
              ]}
            >
              {option}
            </Text>
            
            {isAnswered && selectedOption === option && (
              <View style={styles.resultIcon}>
                {option === currentQuestion.correctAnswer ? (
                  <CheckCircle size={20} color="#4CAF50" />
                ) : (
                  <XCircle size={20} color="#F44336" />
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {isAnswered && (
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: themeColor }]}
          onPress={handleNextQuestion}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < questions.length - 1 ? 
              (tr.nextQuestion || "Sonraki Soru") : (tr.seeResults || "Sonuçları Gör")
            }
          </Text>
          <ArrowRight size={20} color="white" style={styles.nextButtonIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  questionWord: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  resultIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  nextButtonIcon: {
    marginLeft: 4,
  },
});