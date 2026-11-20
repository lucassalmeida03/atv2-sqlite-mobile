// ============================================================
// Tela de Cadastro
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { useAuth } from '../src/hooks/useAuth';

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const { register, loading, error, clearError } = useAuth();
  const router = useRouter();

  async function handleRegister() {
    clearError();
    if (senha !== confirmarSenha) {
      return;
    }
    const success = await register(nome, email, senha);
    if (success) {
      router.replace('/(protected)/home');
    }
  }

  const senhasDiferentes = confirmarSenha.length > 0 && senha !== confirmarSenha;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-add-outline" size={36} color="#4a90d9" />
            </View>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
          </View>

          <View style={styles.form}>
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color="#e74c3c" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Nome completo"
              placeholder="Seu nome"
              value={nome}
              onChangeText={setNome}
            />

            <Input
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Senha"
              placeholder="Mínimo 4 caracteres"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <Input
              label="Confirmar senha"
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
              error={senhasDiferentes ? 'As senhas não coincidem.' : undefined}
            />

            <Button
              title="Criar conta"
              onPress={handleRegister}
              loading={loading}
              disabled={!nome.trim() || !email.trim() || !senha.trim() || senhasDiferentes}
            />

            <Button
              title="Já tenho uma conta"
              onPress={() => router.back()}
              variant="outline"
              style={{ marginTop: 12 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e8f4fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    flex: 1,
  },
});

