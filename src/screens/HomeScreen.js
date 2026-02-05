import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { initDB, adicionarProduto, buscarProdutos } from '../services/Database'; // Importando do lugar certo
import ProductItem from '../components/ProductItem'; // Usando o componente novo

export default function HomeScreen() {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [lista, setLista] = useState([]);

  useEffect(() => {
    initDB()
      .then(() => {
        console.log('Banco pronto');
        atualizarLista();
      })
      .catch(err => console.log('Erro DB:', err));
  }, []);

  const atualizarLista = () => {
    buscarProdutos()
      .then(produtos => setLista(produtos))
      .catch(err => console.log(err));
  };

  const handleSalvar = () => {
    if (nome && marca) {
      // Preço fixo simulado
      adicionarProduto(nome, marca, 1500.00, 'Descrição teste') 
        .then(() => {
          atualizarLista();
          setNome('');
          setMarca('');
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Vintage Audio Store 📻</Text>
      
      <View style={styles.form}>
        <TextInput 
          placeholder="Nome do Equipamento" 
          style={styles.input} 
          value={nome}
          onChangeText={setNome}
        />
        <TextInput 
          placeholder="Marca" 
          style={styles.input} 
          value={marca}
          onChangeText={setMarca}
        />
        <Button title="Adicionar Item" onPress={handleSalvar} color="#d35400" />
      </View>

      <FlatList
        data={lista}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ProductItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', paddingTop: 50 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50', textAlign: 'center' },
  form: { marginBottom: 20 },
  input: { backgroundColor: 'white', padding: 12, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ddd' },
});