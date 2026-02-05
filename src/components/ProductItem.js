import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones padrão do Expo

export default function ProductItem({ item, onDelete }) {
  return (
    <View style={styles.item}>
      <View style={styles.infoContainer}>
        <Text style={styles.marca}>{item.marca}</Text>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.botaoDelete}>
        <Ionicons name="trash-outline" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row', // Alinha info e botão lado a lado
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  infoContainer: {
    flex: 1, // Ocupa o espaço disponível
  },
  marca: { fontSize: 12, color: '#7f8c8d', textTransform: 'uppercase' },
  nome: { fontSize: 16, color: '#2c3e50', fontWeight: 'bold' },
  preco: { fontWeight: 'bold', color: '#27ae60', fontSize: 16, marginTop: 4 },
  botaoDelete: {
    padding: 10, // Aumenta a área de toque
  }
});