// ============================================================
// Componente: Card do Livro com capa
// ============================================================

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../types';

const DEFAULT_COVER = 'https://via.placeholder.com/120x180.png?text=Sem+Capa';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  const coverSource = book.capa_uri
    ? { uri: book.capa_uri }
    : { uri: DEFAULT_COVER };

  return (
    <View style={styles.card}>
      <Image
        source={coverSource}
        style={styles.cover}
        resizeMode="cover"
        defaultSource={require('../../assets/icon.png')}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{book.titulo}</Text>
        <Text style={styles.author}>{book.autor}</Text>
        <View style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{book.genero}</Text>
          </View>
          <Text style={styles.year}>{book.ano_publicacao}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.price}>R$ {book.preco.toFixed(2)}</Text>
          <Text style={styles.stock}>Estoque: {book.quantidade_estoque}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(book)}>
            <Ionicons name="create-outline" size={18} color="#4a90d9" />
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(book)}>
            <Ionicons name="trash-outline" size={18} color="#e74c3c" />
            <Text style={styles.deleteText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cover: {
    width: 90,
    height: 130,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  author: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    color: '#4a90d9',
    fontWeight: '600',
  },
  year: {
    fontSize: 12,
    color: '#999',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#27ae60',
  },
  stock: {
    fontSize: 12,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 4,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    color: '#4a90d9',
    fontSize: 13,
    fontWeight: '500',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteText: {
    color: '#e74c3c',
    fontSize: 13,
    fontWeight: '500',
  },
});

