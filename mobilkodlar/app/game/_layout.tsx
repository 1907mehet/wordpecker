import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import tr from '@/constants/localization';

export default function GameLayout() {
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
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: tr.storyAdventure,
          headerBackTitle: tr.back,
        }}
      />
      <Stack.Screen
        name="level/[id]"
        options={{
          title: "Bölüm",
          headerBackTitle: tr.backToMap,
        }}
      />
    </Stack>
  );
}