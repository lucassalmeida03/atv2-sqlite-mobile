// ============================================================
// Protected Layout: Guard de autenticação
// ============================================================

import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuthContext } from '../../src/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function ProtectedLayout() {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user]);

  if (isLoading || !user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4a90d9" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f5f7fa' },
        animation: 'slide_from_right',
      }}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
});

