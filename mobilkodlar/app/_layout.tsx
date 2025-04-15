import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { colors } from "@/constants/colors";
import { initializeWordListStore } from "@/store/wordlist-store";
import tr from "@/constants/localization";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // Initialize stores with mock data
      initializeWordListStore();
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="game" options={{ headerShown: false }} />
      <Stack.Screen name="game/index" options={{ headerShown: false }} />
      <Stack.Screen name="game/level/[id]" options={{ headerShown: false }} />
      <Stack.Screen 
        name="list/[id]" 
        options={{ 
          title: tr.listDetails || "Liste Detayları",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="list/create" 
        options={{ 
          title: tr.createNewList || "Yeni Liste Oluştur",
          animation: "slide_from_bottom",
        }} 
      />
      <Stack.Screen 
        name="list/edit/[id]" 
        options={{ 
          title: tr.editList || "Listeyi Düzenle",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="word/add/[listId]" 
        options={{ 
          title: tr.addWord || "Kelime Ekle",
          animation: "slide_from_bottom",
        }} 
      />
      <Stack.Screen 
        name="word/edit/[listId]/[wordId]" 
        options={{ 
          title: tr.editWord || "Kelimeyi Düzenle",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="learn/[listId]" 
        options={{ 
          title: tr.learningMode || "Öğrenme Modu",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="quiz/[listId]" 
        options={{ 
          title: tr.quizMode || "Quiz Modu",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="quiz/results/[listId]" 
        options={{ 
          title: tr.quizResults || "Quiz Sonuçları",
          animation: "slide_from_bottom",
          presentation: "modal",
        }} 
      />
    </Stack>
  );
}