// ============================================================
// Tela Home: Listagem paginada de livros
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BookCard } from '../../src/components/BookCard';
import { PaginationControls } from '../../src/components/PaginationControls';
import { ConfirmModal } from '../../src/components/ConfirmModal';
import { useBooks } from '../../src/hooks/useBooks';
import { useAuth } from '../../src/hooks/useAuth';
import { Book } from '../../src/types';

export default function HomeScreen() {
  const {
    books,
    loading,
    page,
    totalPages,
    totalItems,
    loadBooks,
    nextPage,
    prevPage,
    deleteBook,
  } = useBooks();

  const { user, logout } = useAuth();
  const router = useRouter();

  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBooks(1);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBooks(page);
    setRefreshing(false);
  }, [page, loadBooks]);

  function handleEdit(book: Book) {
    router.push(`/(protected)/edit/${book.id}`);
  }

  function handleDeletePress(book: Book) {
    setDeleteTarget(book);
  }

  async function confirmDelete() {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    await deleteBook(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  }

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.nome?.split(' ')[0]} 👋</Text>
          <Text style={styles.headerTitle}>Meu Acervo</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading && books.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#4a90d9" />
            <Text style={styles.loadingText}>Carregando livros...</Text>
          </View>
        ) : books.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="book-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Nenhum livro cadastrado</Text>
            <Text style={styles.emptyText}>
              Toque no botão + para adicionar seu primeiro livro.
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={books}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <BookCard book={item} onEdit={handleEdit} onDelete={handleDeletePress} />
              )}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4a90d9']} />
              }
            />

            <PaginationControls
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              onPrevious={prevPage}
              onNext={nextPage}
            />
          </>
        )}
      </View>

      {/* FAB - Botão de adicionar */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(protected)/create')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        visible={!!deleteTarget}
        title="Excluir livro"
        message={`Tem certeza que deseja excluir "${deleteTarget?.titulo}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 14,
    color: '#888',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a2e',
    marginTop: 2,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#888',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#666',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  list: {
    paddingBottom: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4a90d9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4a90d9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

