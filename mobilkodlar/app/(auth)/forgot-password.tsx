import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuthStore } from '@/store/auth-store';
import { Mail, ArrowLeft } from 'lucide-react-native';
import tr from '@/constants/localization';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { forgotPassword, isLoading, error } = useAuthStore();
  
  const validateForm = () => {
    let isValid = true;
    
    // Validate email
    if (!email) {
      setEmailError(tr.required);
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(tr.invalidEmail);
      isValid = false;
    } else {
      setEmailError('');
    }
    
    return isValid;
  };
  
  const handleResetPassword = async () => {
    if (validateForm()) {
      await forgotPassword(email);
      if (!error) {
        setIsSubmitted(true);
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.content}>
            {!isSubmitted ? (
              <>
                <Text style={styles.title}>{tr.resetPassword}</Text>
                <Text style={styles.subtitle}>
                  {tr.resetPasswordSubtitle}
                </Text>
                
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}
                
                <View style={styles.form}>
                  <Input
                    label={tr.email}
                    placeholder={`${tr.email} adresinizi girin`}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={emailError}
                    leftIcon={<Mail size={20} color={colors.textSecondary} />}
                  />
                  
                  <Button
                    title="Sıfırlama Bağlantısı Gönder"
                    onPress={handleResetPassword}
                    variant="primary"
                    isLoading={isLoading}
                    style={styles.button}
                  />
                </View>
              </>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Mail size={48} color={colors.primary} />
                </View>
                <Text style={styles.successTitle}>{tr.checkEmail}</Text>
                <Text style={styles.successMessage}>
                  {tr.passwordResetSent} {email}
                </Text>
                <Button
                  title={tr.backToLogin}
                  onPress={() => router.push('/login')}
                  variant="primary"
                  style={styles.button}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 16,
  },
  successContainer: {
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
});