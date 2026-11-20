// ============================================================
// Index: Redireciona para login ou home
// ============================================================

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../src/contexts/AuthContext';

export default function Index() {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/(protected)/home');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4a90d9" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
});
