import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Keyboard } from 'react-native';
import { initDB, adicionarProduto, buscarProdutos } from '../services/Database';
import ProductItem from '../components/ProductItem';

export default function HomeScreen() {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState(''); // Novo campo
  const [descricao, setDescricao] = useState(''); // Novo campo
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
    // Validação simples: Nome, Marca e Preço são obrigatórios
    if (!nome || !marca || !preco) {
      Alert.alert('Atenção', 'Por favor, preencha Nome, Marca e Preço.');
      return;
    }

    // Convertendo preço de texto ("1500") para numero (1500.00)
    const precoNumero = parseFloat(preco.replace(',', '.')); // Aceita virgula ou ponto

    if (isNaN(precoNumero)) {
      Alert.alert('Erro', 'O preço deve ser um número válido.');
      return;
    }

    adicionarProduto(nome, marca, precoNumero, descricao)
      .then(() => {
        Alert.alert('Sucesso', 'Item cadastrado com sucesso!');
        atualizarLista();
        // Limpar os campos
        setNome('');
        setMarca('');
        setPreco('');
        setDescricao('');
        Keyboard.dismiss(); // Esconde o teclado
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Erro', 'Não foi possível salvar o item.');
      });
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
        
        {/* Novos Campos */}
        <View style={styles.row}>
          <TextInput 
            placeholder="Preço (R$)" 
            style={[styles.input, styles.inputMetade]} 
            value={preco}
            onChangeText={setPreco}
            keyboardType="numeric" // Teclado numérico
          />
          <TextInput 
            placeholder="Descrição (Opcional)" 
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
        renderItem={({ item }) => <ProductItem item={item} />}
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
  inputMetade: { width: '48%' }, // Divide os campos em dois
  lista: { paddingBottom: 50 }
});