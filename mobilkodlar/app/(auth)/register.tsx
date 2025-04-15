import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuthStore } from '@/store/auth-store';
import { Mail, Lock, User } from 'lucide-react-native';
import tr from '@/constants/localization';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { register, isLoading, error } = useAuthStore();
  
  const validateForm = () => {
    let isValid = true;
    
    // Validate name
    if (!name) {
      setNameError(tr.required);
      isValid = false;
    } else {
      setNameError('');
    }
    
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
    
    // Validate password
    if (!password) {
      setPasswordError(tr.required);
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(tr.passwordTooShort);
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError(tr.required);
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError(tr.passwordsDontMatch);
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };
  
  const handleRegister = async () => {
    if (validateForm()) {
      await register({ name, email, password });
      
      // If registration is successful, the auth store will update and the user will be redirected
      // from the welcome screen useEffect
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
          <View style={styles.content}>
            <Text style={styles.title}>{tr.register}</Text>
            <Text style={styles.subtitle}>{tr.registerSubtitle}</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <View style={styles.form}>
              <Input
                label={tr.name}
                placeholder={`${tr.name}ınızı girin`}
                value={name}
                onChangeText={setName}
                error={nameError}
                leftIcon={<User size={20} color={colors.textSecondary} />}
              />
              
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
              
              <Input
                label={tr.password}
                placeholder="Bir şifre oluşturun"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                isPassword
                error={passwordError}
                leftIcon={<Lock size={20} color={colors.textSecondary} />}
              />
              
              <Input
                label={tr.confirmPassword}
                placeholder="Şifrenizi onaylayın"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                isPassword
                error={confirmPasswordError}
                leftIcon={<Lock size={20} color={colors.textSecondary} />}
              />
              
              <Button
                title={tr.register}
                onPress={handleRegister}
                variant="primary"
                isLoading={isLoading}
                style={styles.button}
              />
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>{tr.alreadyHaveAccount}</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.footerLink}>{tr.login}</Text>
            </TouchableOpacity>
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
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 24,
    gap: 4,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});