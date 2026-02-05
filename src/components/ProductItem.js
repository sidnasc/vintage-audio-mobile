import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProductItem({ item, onDelete, onEdit }) {
  return (
    <View style={styles.containerExterno}>
      {/* 1. Ao clicar na parte branca, chama a edição */}
      <TouchableOpacity style={styles.infoContainer} onPress={() => onEdit(item)}>
        <View>
          <Text style={styles.marca}>{item.marca}</Text>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>

      {/* 2. Botão de Deletar separado */}
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.botaoDelete}>
        <Ionicons name="trash-outline" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerExterno: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    overflow: 'hidden' // Garante que o ripple não saia da borda
  },
  infoContainer: {
    flex: 1, // Ocupa todo o espaço que sobra
    padding: 15,
  },
  marca: { fontSize: 12, color: '#7f8c8d', textTransform: 'uppercase' },
  nome: { fontSize: 16, color: '#2c3e50', fontWeight: 'bold' },
  preco: { fontWeight: 'bold', color: '#27ae60', fontSize: 16, marginTop: 4 },
  botaoDelete: {
    padding: 15,
    height: '100%', // Botão ocupa toda a altura
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#eee'
  }
});