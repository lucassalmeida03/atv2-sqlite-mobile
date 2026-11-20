// ============================================================
// Root Layout: AuthProvider + Expo Router Stack
// ============================================================

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f5f7fa' },
          animation: 'slide_from_right',
        }}
      />
    </AuthProvider>
  );
}

