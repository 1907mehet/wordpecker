import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/colors';
import tr from '@/constants/localization';
import { Home, BookOpen, Search, BarChart2, Settings, Map, DoorOpen } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: tr.home,
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: tr.myLists,
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: tr.search,
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: tr.progress,
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: tr.storyMap,
          tabBarIcon: ({ color }) => <Map size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vocab-game"
        options={{
          title: tr.doorGame,
          tabBarIcon: ({ color }) => <DoorOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: tr.settings,
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}