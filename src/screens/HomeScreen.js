import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Keyboard, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { initDB, adicionarProduto, buscarProdutos, removerProduto } from '../services/Database';
import ProductItem from '../components/ProductItem';

export default function HomeScreen() {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [lista, setLista] = useState([]);
  
  // Controle do Modal (Janela de Cadastro)
  const [modalVisible, setModalVisible] = useState(false);

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
        setModalVisible(false); // Fecha o modal após salvar
        Keyboard.dismiss();
      })
      .catch(err => console.log(err));
  };

  const handleRemover = (id) => {
    Alert.alert(
      "Excluir Item",
      "Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          onPress: () => {
            removerProduto(id).then(atualizarLista);
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Vintage Audio Store 📻</Text>
      
      {/* LISTA DE PRODUTOS */}
      <FlatList
        data={lista}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem item={item} onDelete={handleRemover} />
        )}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum equipamento cadastrado.</Text>}
      />

      {/* BOTÃO FLUTUANTE (FAB) */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* MODAL DE CADASTRO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitulo}>Novo Equipamento</Text>
            
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

            <View style={styles.botoesModal}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#7f8c8d" />
              <View style={{width: 10}} /> 
              <Button title="Salvar" onPress={handleSalvar} color="#d35400" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50', textAlign: 'center' },
  lista: { paddingHorizontal: 20, paddingBottom: 100 }, // Espaço extra pro FAB não cobrir o último item
  textoVazio: { textAlign: 'center', marginTop: 50, color: '#aaa' },
  
  // Estilos do FAB
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 30,
    backgroundColor: '#d35400',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },

  // Estilos do Modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)' // Fundo escuro transparente
  },
  modalView: {
    width: '90%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5
  },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#f9f9f9', padding: 12, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputMetade: { width: '48%' },
  botoesModal: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }
});