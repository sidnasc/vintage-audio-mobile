import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Keyboard } from 'react-native';
import { initDB, adicionarProduto, buscarProdutos, removerProduto } from '../services/Database';
import ProductItem from '../components/ProductItem';

export default function HomeScreen() {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [lista, setLista] = useState([]);

  useEffect(() => {
    initDB().then(atualizarLista);
  }, []);

  const atualizarLista = () => {
    buscarProdutos()
      .then(produtos => setLista(produtos))
      .catch(err => console.log(err));
  };

  const handleSalvar = () => {
    if (!nome || !marca || !preco) {
      Alert.alert('Atenção', 'Preencha Nome, Marca e Preço');
      return;
    }

    const precoNumero = parseFloat(preco.replace(',', '.'));
    if (isNaN(precoNumero)) return Alert.alert('Erro', 'Preço inválido');

    adicionarProduto(nome, marca, precoNumero, descricao)
      .then(() => {
        atualizarLista();
        setNome('');
        setMarca('');
        setPreco('');
        setDescricao('');
        Keyboard.dismiss();
      })
      .catch(err => console.log(err));
  };

  // NOVA FUNÇÃO: Deletar com confirmação
  const handleRemover = (id) => {
    Alert.alert(
      "Excluir Item",
      "Tem certeza que deseja remover este equipamento?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          onPress: () => {
            removerProduto(id)
              .then(() => {
                atualizarLista(); // Atualiza a lista após deletar
              })
              .catch(err => console.log(err));
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Vintage Audio Store 📻</Text>
      
      <View style={styles.form}>
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
        <View style={styles.row}>
          <TextInput 
            placeholder="Preço (R$)" 
            style={[styles.input, styles.inputMetade]} 
            value={preco}
            onChangeText={setPreco}
            keyboardType="numeric" 
          />
          <TextInput 
            placeholder="Descrição" 
            style={[styles.input, styles.inputMetade]} 
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>
        <Button title="SALVAR PRODUTO" onPress={handleSalvar} color="#d35400" />
      </View>

      <FlatList
        data={lista}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem 
            item={item} 
            onDelete={handleRemover} // Passando a função para o componente filho
          />
        )}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', paddingTop: 50 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50', textAlign: 'center' },
  form: { marginBottom: 20 },
  input: { backgroundColor: 'white', padding: 12, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ddd' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputMetade: { width: '48%' },
  lista: { paddingBottom: 50 }
});