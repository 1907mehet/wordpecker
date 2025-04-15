import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface CountdownTimerProps {
  seconds: number;
  onComplete: () => void;
  style?: ViewStyle;
}

export default function CountdownTimer({ seconds, onComplete, style }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const progressAnim = useState(new Animated.Value(1))[0];
  
  useEffect(() => {
    // Reset when seconds change
    setTimeLeft(seconds);
    progressAnim.setValue(1);
    
    // Start the countdown
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    // Animate the progress bar
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: seconds * 1000,
      useNativeDriver: false,
    }).start();
    
    return () => clearInterval(timer);
  }, [seconds, onComplete]);
  
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  
  // Change color based on time remaining
  const timerColor = timeLeft <= 3 ? colors.error : colors.primary;
  
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}</Text>
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            { width: progressWidth, backgroundColor: timerColor }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressContainer: {
    width: 100,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});