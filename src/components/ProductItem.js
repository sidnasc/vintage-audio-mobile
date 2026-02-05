import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProductItem({ item }) {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.marca}>{item.marca}</Text>
        <Text style={styles.nome}>{item.nome}</Text>
      </View>
      <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2, // Sombra no Android
  },
  marca: { fontSize: 12, color: '#7f8c8d', textTransform: 'uppercase' },
  nome: { fontSize: 16, color: '#2c3e50', fontWeight: 'bold' },
  preco: { fontWeight: 'bold', color: '#27ae60', fontSize: 16 }
});