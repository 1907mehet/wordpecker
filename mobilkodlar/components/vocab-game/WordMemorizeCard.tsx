import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { WordPair } from '@/types/vocab-game';

interface WordMemorizeCardProps {
  wordPair: WordPair;
}

export default function WordMemorizeCard({ wordPair }: WordMemorizeCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.englishText}>{wordPair.english}</Text>
      <View style={styles.divider} />
      <Text style={styles.turkishText}>{wordPair.turkish}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  englishText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'left',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  turkishText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primary,
    flex: 1,
    textAlign: 'right',
  },
});