import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProductItem({ item, onDelete, onEdit, onDetail, isAdmin }) {
  return (
    <View style={styles.containerExterno}>
      <TouchableOpacity 
        style={styles.infoContainer} 
        // LÓGICA DO CLIQUE:
        // Se for Admin -> Abre Edição
        // Se for Cliente -> Abre Detalhes (onDetail)
        onPress={() => isAdmin ? onEdit(item) : onDetail(item)} 
        activeOpacity={0.7}
      >
        {item.imagem ? (
          <Image source={{ uri: item.imagem }} style={styles.imagem} />
        ) : (
          <View style={styles.imagemPlaceholder}>
            <Ionicons name="image-outline" size={30} color="#ccc" />
          </View>
        )}

        <View style={styles.textos}>
          <Text style={styles.marca}>{item.marca}</Text>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>

      {isAdmin && (
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.botaoDelete}>
          <Ionicons name="trash-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerExterno: {
    backgroundColor: 'white', marginBottom: 10, borderRadius: 8,
    flexDirection: 'row', alignItems: 'center', elevation: 2, overflow: 'hidden'
  },
  infoContainer: {
    flex: 1, padding: 10, flexDirection: 'row', alignItems: 'center'
  },
  imagem: {
    width: 60, height: 60, borderRadius: 4, marginRight: 15, backgroundColor: '#eee'
  },
  imagemPlaceholder: {
    width: 60, height: 60, borderRadius: 4, marginRight: 15, backgroundColor: '#f0f0f0',
    alignItems: 'center', justifyContent: 'center'
  },
  textos: { flex: 1 },
  marca: { fontSize: 12, color: '#7f8c8d', textTransform: 'uppercase' },
  nome: { fontSize: 16, color: '#2c3e50', fontWeight: 'bold' },
  preco: { fontWeight: 'bold', color: '#27ae60', fontSize: 16, marginTop: 4 },
  botaoDelete: {
    padding: 15, height: '100%', justifyContent: 'center',
    borderLeftWidth: 1, borderLeftColor: '#eee'
  }
});