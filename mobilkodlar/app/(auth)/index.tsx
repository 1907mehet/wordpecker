import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { BookOpen } from 'lucide-react-native';
import tr from '@/constants/localization';

export default function WelcomeScreen() {
  const { user } = useAuthStore();
  const isMounted = React.useRef(false);
  
  // Set up mounting ref
  React.useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Handle navigation based on user state in a separate effect
  React.useEffect(() => {
    if (user && isMounted.current) {
      // Add a small delay to ensure the root layout is fully mounted
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
    }
  }, [user]);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <BookOpen size={64} color={colors.primary} />
          <Text style={styles.logoText}>{tr.appName || "KelimeÖğren"}</Text>
        </View>
        
        <Text style={styles.tagline}>
          {tr.welcomeSubtitle || "Türkçe kelime öğrenmenin en etkili yolu"}
        </Text>
        
        <View style={styles.featureContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📚</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>
                {tr.features?.createListsTitle || "Kişiselleştirilmiş Listeler"}
              </Text>
              <Text style={styles.featureDescription}>
                {tr.features?.createListsDesc || "Kendi kelime listelerinizi oluşturun ve düzenleyin"}
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>🧠</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>
                {tr.features?.interactiveLearningTitle || "Etkileşimli Öğrenme"}
              </Text>
              <Text style={styles.featureDescription}>
                {tr.features?.interactiveLearningDesc || "Oyunlar ve quizler ile eğlenerek öğrenin"}
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📊</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>
                {tr.features?.trackProgressTitle || "İlerleme Takibi"}
              </Text>
              <Text style={styles.featureDescription}>
                {tr.features?.trackProgressDesc || "Öğrenme sürecinizi izleyin ve motivasyonunuzu koruyun"}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title={tr.login}
          onPress={() => router.push('/login')}
          variant="primary"
          style={styles.button}
        />
        
        <Button
          title={tr.register}
          onPress={() => router.push('/register')}
          variant="outline"
          style={styles.button}
        />
        
        <Button
          title={tr.continueAsGuest || "Misafir Olarak Devam Et"}
          onPress={() => router.replace('/(tabs)')}
          variant="text"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  tagline: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
  },
  featureContainer: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  buttonContainer: {
    padding: 24,
    width: '100%',
  },
  button: {
    marginBottom: 12,
    width: '100%',
  },
});