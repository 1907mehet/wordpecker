import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import tr from '@/constants/localization';
import { Info } from 'lucide-react-native';

interface VocabularyWord {
  word: string;
  definition: string;
  translation: string;
}

interface StoryDisplayProps {
  story: string;
  vocabularyWords: VocabularyWord[];
  themeColor: string;
}

export default function StoryDisplay({ 
  story, 
  vocabularyWords,
  themeColor
}: StoryDisplayProps) {
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  
  // Function to highlight vocabulary words in the story
  const highlightWords = () => {
    let highlightedStory = story;
    
    // We need to highlight all 3 vocabulary words
    vocabularyWords.forEach(vocabWord => {
      // Create a regex that matches the word with word boundaries
      const regex = new RegExp(`\\b${vocabWord.word}\\b`, 'gi');
      
      // Replace all occurrences of the word
      highlightedStory = highlightedStory.replace(regex, (match) => {
        return `__HIGHLIGHT__${match}__ENDHIGHLIGHT__`;
      });
    });
    
    // Split by highlighted sections
    const parts = highlightedStory.split(/__HIGHLIGHT__|__ENDHIGHLIGHT__/);
    
    return parts.map((part, index) => {
      // Every third part is a highlighted word (after splitting by start and end markers)
      const isHighlighted = index % 3 === 1;
      
      if (isHighlighted) {
        // Find which vocabulary word this is
        const highlightedWord = vocabularyWords.find(word => 
          part.toLowerCase() === word.word.toLowerCase()
        );
        
        if (highlightedWord) {
          return (
            <TouchableOpacity 
              key={`${part}-${index}`}
              onPress={() => setSelectedWord(highlightedWord)}
              activeOpacity={0.7}
            >
              <Text style={[styles.highlightedWord, { color: '#4CAF50' }]}>
                {part}
              </Text>
            </TouchableOpacity>
          );
        }
      }
      
      return <Text key={`${part}-${index}`}>{part}</Text>;
    });
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.storyContainer}>
        <Text style={styles.storyText}>
          {highlightWords()}
        </Text>
      </ScrollView>
      
      {selectedWord && (
        <View style={styles.wordInfoContainer}>
          <View style={[styles.wordInfoHeader, { backgroundColor: themeColor }]}>
            <Text style={styles.wordInfoTitle}>{selectedWord.word}</Text>
            <TouchableOpacity 
              onPress={() => setSelectedWord(null)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.wordInfoContent}>
            <View style={styles.wordInfoRow}>
              <Text style={styles.wordInfoLabel}>{tr.translation || "Çeviri"}:</Text>
              <Text style={styles.wordInfoValue}>{selectedWord.translation}</Text>
            </View>
            
            <View style={styles.wordInfoRow}>
              <Text style={styles.wordInfoLabel}>{tr.definition || "Tanım"}:</Text>
              <Text style={styles.wordInfoValue}>{selectedWord.definition}</Text>
            </View>
          </View>
        </View>
      )}
      
      <View style={styles.instructionContainer}>
        <Info size={16} color={themeColor} />
        <Text style={styles.instructionText}>
          {tr.tapHighlightedWords || "Çevirileri görmek için vurgulanan kelimelere dokunun"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  storyContainer: {
    maxHeight: 300,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  highlightedWord: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  wordInfoContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  wordInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  wordInfoTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  wordInfoContent: {
    padding: 16,
    backgroundColor: 'white',
  },
  wordInfoRow: {
    marginBottom: 12,
  },
  wordInfoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  wordInfoValue: {
    fontSize: 16,
    color: colors.text,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});