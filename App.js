import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { initDB, adicionarProduto, buscarProdutos } from './src/services/Database';

export default function App() {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [lista, setLista] = useState([]);

  // 1. Inicia o Banco ao abrir o App
  useEffect(() => {
    initDB()
      .then(() => {
        console.log('Banco criado!');
        atualizarLista();
      })
      .catch(err => console.log('Erro ao criar banco:', err));
  }, []);

  // 2. Função para recarregar a lista
  const atualizarLista = () => {
    buscarProdutos()
      .then(produtos => setLista(produtos))
      .catch(err => console.log(err));
  };

  // 3. Função para salvar
  const handleSalvar = () => {
    if (nome && marca) {
      adicionarProduto(nome, marca, 1500.00, 'Impecável') // Preço fixo só pra teste
        .then(() => {
          atualizarLista();
          setNome(''); // Limpa campo
          setMarca('');
          alert('Item Vintage Salvo!');
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Vintage Audio Store 📻</Text>
      
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Nome (ex: Receiver 2250B)" 
          style={styles.input} 
          value={nome}
          onChangeText={setNome}
        />
        <TextInput 
          placeholder="Marca (ex: Marantz)" 
          style={styles.input} 
          value={marca}
          onChangeText={setMarca}
        />
        <Button title="CADASTRAR" onPress={handleSalvar} color="#d35400" />
      </View>

      <FlatList
        data={lista}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.textoItem}>🎵 {item.marca} - {item.nome}</Text>
            <Text style={styles.preco}>R$ {item.preco}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', marginTop: 30 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
  inputContainer: { marginBottom: 20 },
  input: { backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ddd' },
  item: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between' },
  textoItem: { fontSize: 16, color: '#333' },
  preco: { fontWeight: 'bold', color: '#27ae60' }
});