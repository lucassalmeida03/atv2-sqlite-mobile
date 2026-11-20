// ============================================================
// Tela de Criação de Livro
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useBooks } from '../../src/hooks/useBooks';

export default function CreateScreen() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');
  const [anoPublicacao, setAnoPublicacao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidadeEstoque, setQuantidadeEstoque] = useState('');
  const [capaUri, setCapaUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addBook } = useBooks();
  const router = useRouter();

  async function pickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para selecionar a capa.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCapaUri(result.assets[0].uri);
    }
  }

  async function handleCreate() {
    setError(null);
    setLoading(true);

    const result = await addBook({
      titulo,
      autor,
      genero,
      ano_publicacao: parseInt(anoPublicacao, 10) || 0,
      preco: parseFloat(preco.replace(',', '.')) || 0,
      quantidade_estoque: parseInt(quantidadeEstoque, 10) || 0,
      capa_uri: capaUri,
    });

    setLoading(false);

    if (result.success) {
      router.back();
    } else {
      setError(result.error || 'Erro ao cadastrar livro.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Livro</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#e74c3c" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Seleção de Capa */}
          <View style={styles.coverSection}>
            <Text style={styles.coverLabel}>Capa do Livro</Text>
            <View style={styles.coverRow}>
              <TouchableOpacity style={styles.coverPicker} onPress={pickImage}>
                {capaUri ? (
                  <Image source={{ uri: capaUri }} style={styles.coverImage} resizeMode="cover" />
                ) : (
                  <View style={styles.coverPlaceholder}>
                    <Ionicons name="camera-outline" size={32} color="#999" />
                    <Text style={styles.coverPlaceholderText}>Galeria</Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.coverUrlContainer}>
                <Input
                  label="Ou insira URL da capa"
                  placeholder="https://..."
                  value={capaUri}
                  onChangeText={setCapaUri}
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          <Input label="Título" placeholder="Nome do livro" value={titulo} onChangeText={setTitulo} />
          <Input label="Autor" placeholder="Nome do autor" value={autor} onChangeText={setAutor} />
          <Input label="Gênero" placeholder="Ex: Romance, Ficção..." value={genero} onChangeText={setGenero} />
          <Input
            label="Ano de Publicação"
            placeholder="Ex: 2024"
            value={anoPublicacao}
            onChangeText={setAnoPublicacao}
            keyboardType="numeric"
          />
          <Input
            label="Preço (R$)"
            placeholder="Ex: 29.90"
            value={preco}
            onChangeText={setPreco}
            keyboardType="decimal-pad"
          />
          <Input
            label="Quantidade em Estoque"
            placeholder="Ex: 10"
            value={quantidadeEstoque}
            onChangeText={setQuantidadeEstoque}
            keyboardType="numeric"
          />

          <View style={{ marginTop: 8 }}>
            <Button
              title="Cadastrar Livro"
              onPress={handleCreate}
              loading={loading}
              disabled={!titulo.trim() || !autor.trim() || !genero.trim()}
            />
            <Button
              title="Cancelar"
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
  coverSection: {
    marginBottom: 16,
  },
  coverLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  coverRow: {
    flexDirection: 'row',
    gap: 12,
  },
  coverPicker: {
    width: 100,
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPlaceholderText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  coverUrlContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

