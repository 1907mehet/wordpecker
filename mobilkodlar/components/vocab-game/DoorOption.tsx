import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';
import { DoorClosed } from 'lucide-react-native';

interface DoorOptionProps {
  english: string;
  turkish: string;
  onSelect: () => void;
  disabled?: boolean;
  isCorrect?: boolean;
  showResult?: boolean;
}

const { width } = Dimensions.get('window');
const doorWidth = width * 0.28;

export default function DoorOption({ 
  english, 
  turkish, 
  onSelect, 
  disabled = false,
  isCorrect,
  showResult = false
}: DoorOptionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.disabledContainer,
        showResult && (isCorrect ? styles.correctContainer : styles.incorrectContainer)
      ]}
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.englishText}>{english}</Text>
      
      <View style={styles.doorContainer}>
        <DoorClosed 
          size={doorWidth * 0.8} 
          color={showResult 
            ? (isCorrect ? colors.success : colors.error) 
            : colors.primary
          } 
        />
      </View>
      
      <Text style={styles.turkishText}>{turkish}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: doorWidth,
    height: doorWidth * 2,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    padding: 10,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledContainer: {
    opacity: 0.7,
  },
  correctContainer: {
    backgroundColor: colors.successLight,
    borderWidth: 2,
    borderColor: colors.success,
  },
  incorrectContainer: {
    backgroundColor: colors.errorLight,
    borderWidth: 2,
    borderColor: colors.error,
  },
  doorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  englishText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 5,
  },
  turkishText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
});