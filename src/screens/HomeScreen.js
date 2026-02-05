import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Keyboard, Modal, TouchableOpacity, Image, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker'; // Importando a câmera/galeria

import { initDB, adicionarProduto, buscarProdutos, removerProduto, atualizarProduto } from '../services/Database';
import ProductItem from '../components/ProductItem';

export default function HomeScreen() {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null); // Estado para a foto
  
  const [lista, setLista] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [idParaEditar, setIdParaEditar] = useState(null);

  // ESTADO DO MODO ADMIN
  const [isAdmin, setIsAdmin] = useState(true); // Começa como Admin

  useEffect(() => {
    initDB().then(atualizarLista);
  }, []);

  const atualizarLista = () => {
    buscarProdutos()
      .then(produtos => setLista(produtos))
      .catch(err => console.log(err));
  };

  // FUNÇÃO PARA PEGAR FOTO
  const selecionarImagem = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const abrirModalNovo = () => {
    setIdParaEditar(null);
    setNome(''); setMarca(''); setPreco(''); setDescricao(''); setImagem(null);
    setModalVisible(true);
  };

  const abrirModalEdicao = (item) => {
    setIdParaEditar(item.id);
    setNome(item.nome);
    setMarca(item.marca);
    setPreco(item.preco.toString());
    setDescricao(item.descricao || '');
    setImagem(item.imagem || null);
    setModalVisible(true);
  };

  const handleSalvar = () => {
    if (!nome || !marca || !preco) {
      Alert.alert('Atenção', 'Preencha Nome, Marca e Preço');
      return;
    }
    const precoNumero = parseFloat(preco.replace(',', '.'));
    
    if (idParaEditar) {
      atualizarProduto(idParaEditar, nome, marca, precoNumero, descricao, imagem)
        .then(() => {
          Alert.alert('Sucesso', 'Atualizado!');
          fecharModalEAtualizar();
        });
    } else {
      adicionarProduto(nome, marca, precoNumero, descricao, imagem)
        .then(() => {
          Alert.alert('Sucesso', 'Cadastrado!');
          fecharModalEAtualizar();
        });
    }
  };

  const fecharModalEAtualizar = () => {
    atualizarLista();
    setModalVisible(false);
    Keyboard.dismiss();
  };

  const handleRemover = (id) => {
    Alert.alert("Excluir", "Tem certeza?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => removerProduto(id).then(atualizarLista), style: "destructive" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      
      {/* CABEÇALHO COM MODO ADMIN/CLIENTE */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Vintage Store 📻</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>{isAdmin ? "Admin" : "Cliente"}</Text>
          <Switch 
            value={isAdmin} 
            onValueChange={setIsAdmin} 
            trackColor={{ false: "#767577", true: "#d35400" }}
          />
        </View>
      </View>
      
      <FlatList
        data={lista}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem 
            item={item} 
            onDelete={handleRemover} 
            onEdit={abrirModalEdicao}
            isAdmin={isAdmin} // Passamos o estado para o item saber como se comportar
          />
        )}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum equipamento cadastrado.</Text>}
      />

      {/* FAB SÓ APARECE SE FOR ADMIN */}
      {isAdmin && (
        <TouchableOpacity style={styles.fab} onPress={abrirModalNovo}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide" transparent={true} visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitulo}>{idParaEditar ? "Editar" : "Novo"} Equipamento</Text>
            
            {/* ÁREA DE FOTO NO MODAL */}
            <TouchableOpacity onPress={selecionarImagem} style={styles.areaFoto}>
              {imagem ? (
                <Image source={{ uri: imagem }} style={styles.fotoPreview} />
              ) : (
                <View style={styles.fotoPlaceholder}>
                  <Ionicons name="camera" size={40} color="#ccc" />
                  <Text style={{color: '#aaa'}}>Adicionar Foto</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
            <TextInput placeholder="Marca" style={styles.input} value={marca} onChangeText={setMarca} />
            
            <View style={styles.row}>
              <TextInput placeholder="Preço" style={[styles.input, styles.inputMetade]} value={preco} onChangeText={setPreco} keyboardType="numeric" />
              <TextInput placeholder="Descrição" style={[styles.input, styles.inputMetade]} value={descricao} onChangeText={setDescricao} />
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
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  switchContainer: { alignItems: 'center' },
  switchLabel: { fontSize: 10, color: '#555', marginBottom: 2 },
  
  lista: { paddingHorizontal: 20, paddingBottom: 100 },
  textoVazio: { textAlign: 'center', marginTop: 50, color: '#aaa' },
  fab: {
    position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center',
    right: 20, bottom: 30, backgroundColor: '#d35400', borderRadius: 30, elevation: 8
  },
  
  // MODAL E FOTO
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '90%', backgroundColor: "white", borderRadius: 20, padding: 25, elevation: 5 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  
  areaFoto: { alignItems: 'center', marginBottom: 15 },
  fotoPreview: { width: '100%', height: 150, borderRadius: 10, resizeMode: 'cover' },
  fotoPlaceholder: { 
    width: '100%', height: 120, backgroundColor: '#f0f0f0', borderRadius: 10, 
    justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' 
  },

  input: { backgroundColor: '#f9f9f9', padding: 12, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputMetade: { width: '48%' },
  botoesModal: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }
});