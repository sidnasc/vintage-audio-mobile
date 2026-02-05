import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Keyboard, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { initDB, adicionarProduto, buscarProdutos, removerProduto, atualizarProduto } from '../services/Database';
import ProductItem from '../components/ProductItem';

export default function HomeScreen() {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [lista, setLista] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // NOVO: Estado para saber se estamos editando alguém
  const [idParaEditar, setIdParaEditar] = useState(null);

  useEffect(() => {
    initDB().then(atualizarLista);
  }, []);

  const atualizarLista = () => {
    buscarProdutos()
      .then(produtos => setLista(produtos))
      .catch(err => console.log(err));
  };

  // Função chamada ao clicar no FAB (+)
  const abrirModalNovo = () => {
    setIdParaEditar(null); // Garante que não tem ID selecionado
    setNome('');
    setMarca('');
    setPreco('');
    setDescricao('');
    setModalVisible(true);
  };

  // Função chamada ao clicar num item da lista
  const abrirModalEdicao = (item) => {
    setIdParaEditar(item.id); // Guardamos o ID
    setNome(item.nome);       // Preenchemos os campos
    setMarca(item.marca);
    setPreco(item.preco.toString());
    setDescricao(item.descricao || ''); // Se não tiver descrição, põe vazio
    setModalVisible(true);
  };

  const handleSalvar = () => {
    if (!nome || !marca || !preco) {
      Alert.alert('Atenção', 'Preencha Nome, Marca e Preço');
      return;
    }

    const precoNumero = parseFloat(preco.replace(',', '.'));
    if (isNaN(precoNumero)) return Alert.alert('Erro', 'Preço inválido');

    // DECISÃO: Criar ou Atualizar?
    if (idParaEditar) {
      // ATUALIZAR
      atualizarProduto(idParaEditar, nome, marca, precoNumero, descricao)
        .then(() => {
          Alert.alert('Sucesso', 'Produto atualizado!');
          fecharModalEAtualizar();
        })
        .catch(err => console.log(err));
    } else {
      // CRIAR NOVO
      adicionarProduto(nome, marca, precoNumero, descricao)
        .then(() => {
          Alert.alert('Sucesso', 'Produto cadastrado!');
          fecharModalEAtualizar();
        })
        .catch(err => console.log(err));
    }
  };

  const fecharModalEAtualizar = () => {
    atualizarLista();
    setModalVisible(false);
    Keyboard.dismiss();
  };

  const handleRemover = (id) => {
    Alert.alert(
      "Excluir Item",
      "Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          onPress: () => removerProduto(id).then(atualizarLista),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Vintage Audio Store 📻</Text>
      
      <FlatList
        data={lista}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem 
            item={item} 
            onDelete={handleRemover} 
            onEdit={abrirModalEdicao} // Passamos a nova função
          />
        )}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum equipamento cadastrado.</Text>}
      />

      {/* Botão abre modal em modo "Novo" */}
      <TouchableOpacity style={styles.fab} onPress={abrirModalNovo}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* Título muda dinamicamente */}
            <Text style={styles.modalTitulo}>
              {idParaEditar ? "Editar Equipamento" : "Novo Equipamento"}
            </Text>
            
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
              <Button title={idParaEditar ? "Atualizar" : "Salvar"} onPress={handleSalvar} color="#d35400" />
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
  lista: { paddingHorizontal: 20, paddingBottom: 100 },
  textoVazio: { textAlign: 'center', marginTop: 50, color: '#aaa' },
  fab: {
    position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center',
    right: 20, bottom: 30, backgroundColor: '#d35400', borderRadius: 30, elevation: 8
  },
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '90%', backgroundColor: "white", borderRadius: 20, padding: 25, elevation: 5 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#f9f9f9', padding: 12, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputMetade: { width: '48%' },
  botoesModal: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }
});