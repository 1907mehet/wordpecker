import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { 
  Moon, 
  Bell, 
  Volume2, 
  Vibrate, 
  Save, 
  Globe, 
  BrainCircuit,
  Clock,
  LogOut,
  User,
  HelpCircle,
  Mail,
  Shield,
  Info
} from 'lucide-react-native';
import { router } from 'expo-router';
import tr from '@/constants/localization';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  
  const handleLogout = () => {
    Alert.alert(
      tr.logout,
      tr.logoutConfirm,
      [
        {
          text: tr.cancel,
          style: "cancel"
        },
        {
          text: tr.logout,
          onPress: () => {
            // First logout to clear the auth state
            logout();
            // Then use requestAnimationFrame to ensure navigation happens in the next frame
            requestAnimationFrame(() => {
              router.replace('/(auth)');
            });
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleResetSettings = () => {
    Alert.alert(
      tr.resetSettings,
      tr.resetSettingsConfirm,
      [
        {
          text: tr.cancel,
          style: "cancel"
        },
        {
          text: tr.resetSettings,
          onPress: resetSettings,
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{tr.settings}</Text>
          <Text style={styles.subtitle}>
            {tr.customizeExperience}
          </Text>
        </View>
        
        {user && (
          <View style={styles.profileSection}>
            <View style={styles.profileIconContainer}>
              <User size={32} color={colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{tr.appearance}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Moon size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{tr.darkMode}</Text>
              <Text style={styles.settingDescription}>
                {tr.switchTheme}
              </Text>
            </View>
            <Switch
              value={settings.theme === 'dark'}
              onValueChange={(value) => 
                updateSettings({ theme: value ? 'dark' : 'light' })
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{tr.notifications}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{tr.pushNotifications}</Text>
              <Text style={styles.settingDescription}>
                {tr.receiveUpdates}
              </Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => 
                updateSettings({ notifications: value })
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Clock size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{tr.sessionReminders}</Text>
              <Text style={styles.settingDescription}>
                {tr.getDailyReminders}
              </Text>
            </View>
            <Switch
              value={settings.sessionReminders}
              onValueChange={(value) => 
                updateSettings({ sessionReminders: value })
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{tr.appPreferences}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Volume2 size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{tr.soundEffects}</Text>
              <Text style={styles.settingDescription}>
                {tr.playSounds}
              </Text>
            </View>
            <Switch
              value={settings.soundEffects}
              onValueChange={(value) => 
                updateSettings({ soundEffects: value })
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
          
          {Platform.OS !== 'web' && (
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Vibrate size={20} color={colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{tr.hapticFeedback}</Text>
                <Text style={styles.settingDescription}>
                  {tr.vibrationFeedback}
                </Text>
              </View>
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(value) => 
                  updateSettings({ hapticFeedback: value })
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          )}
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Save size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{tr.autoSave}</Text>
              <Text style={styles.settingDescription}>
                {tr.autoSaveChanges}
              </Text>
            </View>
            <Switch
              value={settings.autoSave}
              onValueChange={(value) => 
                updateSettings({ autoSave: value })
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              // This would open a language selection modal in a real app
              Alert.alert("Dil Seçimi", "Bu özellik demo sürümünde uygulanmamıştır");
            }}
          >
            <View style={styles.settingIconContainer}>
              <Globe size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{tr.defaultLanguage}</Text>
              <Text style={styles.settingDescription}>
                {tr.languages[settings.defaultLanguage] || settings.defaultLanguage}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              // This would open a difficulty selection modal in a real app
              Alert.alert("Zorluk Seçimi", "Bu özellik demo sürümünde uygulanmamıştır");
            }}
          >
            <View style={styles.settingIconContainer}>
              <BrainCircuit size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{tr.quizDifficulty}</Text>
              <Text style={styles.settingDescription}>
                {tr.difficulties[settings.quizDifficulty]}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{tr.support}</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              Alert.alert("Yardım ve Destek", "Bu özellik demo sürümünde uygulanmamıştır");
            }}
          >
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{tr.helpAndSupport}</Text>
              <Text style={styles.settingDescription}>
                {tr.getHelp}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              Alert.alert("Bize Ulaşın", "Bu özellik demo sürümünde uygulanmamıştır");
            }}
          >
            <View style={styles.settingIconContainer}>
              <Mail size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{tr.contactUs}</Text>
              <Text style={styles.settingDescription}>
                {tr.sendFeedback}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              Alert.alert("Gizlilik Politikası", "Bu özellik demo sürümünde uygulanmamıştır");
            }}
          >
            <View style={styles.settingIconContainer}>
              <Shield size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{tr.privacyPolicy}</Text>
              <Text style={styles.settingDescription}>
                {tr.howWeHandleData}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              Alert.alert("WordPecker Hakkında", "Sürüm 1.0.0\n\nWordPecker, herhangi bir dilde kelime öğrenmenize yardımcı olmak için tasarlanmış interaktif egzersizler ve sınavlar sunan bir kelime öğrenme uygulamasıdır.");
            }}
          >
            <View style={styles.settingIconContainer}>
              <Info size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{tr.about}</Text>
              <Text style={styles.settingDescription}>
                {tr.appVersion}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={handleResetSettings}
          >
            <Text style={styles.resetButtonText}>{tr.resetSettings}</Text>
          </TouchableOpacity>
          
          {user && (
            <TouchableOpacity
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <LogOut size={18} color="white" />
              <Text style={styles.logoutButtonText}>{tr.logout}</Text>
            </TouchableOpacity>
          )}
        </View>
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionButtons: {
    marginTop: 8,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  resetButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  logoutButton: {
    backgroundColor: colors.error,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});