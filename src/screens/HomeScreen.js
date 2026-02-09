import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Keyboard, Modal, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker'; 

import { initDB, adicionarProduto, buscarProdutos, removerProduto, atualizarProduto } from '../services/Database';
import ProductItem from '../components/ProductItem';

export default function HomeScreen() {
  // --- ESTADOS DO FORMULÁRIO ---
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  
  // --- ESTADOS DE CONTROLE ---
  const [lista, setLista] = useState([]); // Lista original do Banco (banco de dados)
  const [listaFiltrada, setListaFiltrada] = useState([]); // Lista que aparece na tela (filtrada)
  const [busca, setBusca] = useState(''); // Texto da pesquisa
  
  const [modalVisible, setModalVisible] = useState(false);
  const [idParaEditar, setIdParaEditar] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true);

  // --- ESTADOS DE DETALHES ---
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // 1. Carrega dados ao abrir
  useEffect(() => {
    initDB().then(atualizarLista);
  }, []);

  // 2. EFEITO DE FILTRO (A Mágica acontece aqui)
  // Toda vez que o texto da 'busca' ou a 'lista' original mudar, esse código roda.
  useEffect(() => {
    if (busca === '') {
      setListaFiltrada(lista);
    } else {
      setListaFiltrada(
        lista.filter(item => 
          item.nome.toLowerCase().includes(busca.toLowerCase()) || 
          item.marca.toLowerCase().includes(busca.toLowerCase())
        )
      );
    }
  }, [busca, lista]);

  const atualizarLista = () => {
    buscarProdutos()
      .then(produtos => setLista(produtos)) // Atualiza a lista original
      .catch(err => console.log(err));
  };

  const selecionarImagem = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [4, 3], quality: 1,
    });
    if (!result.canceled) setImagem(result.assets[0].uri);
  };

  const abrirModalNovo = () => {
    setIdParaEditar(null);
    setNome(''); setMarca(''); setPreco(''); setDescricao(''); setImagem(null);
    setModalVisible(true);
  };

  const abrirModalEdicao = (item) => {
    setIdParaEditar(item.id);
    setNome(item.nome); setMarca(item.marca); setPreco(item.preco.toString());
    setDescricao(item.descricao || ''); setImagem(item.imagem || null);
    setModalVisible(true);
  };

  const abrirDetalhes = (item) => {
    setProdutoSelecionado(item);
    setModalDetalhesVisible(true);
  };

  const handleSalvar = () => {
    if (!nome || !marca || !preco) return Alert.alert('Atenção', 'Preencha Nome, Marca e Preço');
    const precoNumero = parseFloat(preco.replace(',', '.'));
    
    const action = idParaEditar 
      ? atualizarProduto(idParaEditar, nome, marca, precoNumero, descricao, imagem)
      : adicionarProduto(nome, marca, precoNumero, descricao, imagem);

    action.then(() => {
      Alert.alert('Sucesso', 'Salvo com sucesso!');
      atualizarLista();
      setModalVisible(false);
      Keyboard.dismiss();
    });
  };

  const handleRemover = (id) => {
    Alert.alert("Excluir", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", onPress: () => removerProduto(id).then(atualizarLista), style: "destructive" }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Vintage Store 📻</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>{isAdmin ? "Admin" : "Cliente"}</Text>
          <Switch value={isAdmin} onValueChange={setIsAdmin} trackColor={{ false: "#767577", true: "#d35400" }} />
        </View>
      </View>

      {/* --- BARRA DE PESQUISA (NOVO) --- */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar por nome ou marca..."
          style={styles.searchInput}
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons name="close-circle" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={listaFiltrada} // Usamos a lista filtrada agora!
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem 
            item={item} 
            onDelete={handleRemover} 
            onEdit={abrirModalEdicao}
            onDetail={abrirDetalhes} 
            isAdmin={isAdmin} 
          />
        )}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum equipamento encontrado.</Text>}
      />

      {isAdmin && (
        <TouchableOpacity style={styles.fab} onPress={abrirModalNovo}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* --- MODAIS (Igual ao anterior) --- */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitulo}>{idParaEditar ? "Editar" : "Novo"} Equipamento</Text>
            <TouchableOpacity onPress={selecionarImagem} style={styles.areaFoto}>
              {imagem ? <Image source={{ uri: imagem }} style={styles.fotoPreview} /> : <View style={styles.fotoPlaceholder}><Ionicons name="camera" size={40} color="#ccc" /><Text style={{color: '#aaa'}}>Foto</Text></View>}
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

      <Modal animationType="fade" transparent={true} visible={modalDetalhesVisible} onRequestClose={() => setModalDetalhesVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalViewDetalhes}>
            {produtoSelecionado && (
              <>
                <Image 
                  // Correção definitiva da imagem placeholder
                  source={produtoSelecionado.imagem ? { uri: produtoSelecionado.imagem } : { uri: 'https://cdn-icons-png.flaticon.com/512/1042/1042390.png' }} 
                  style={styles.fotoDetalhe} 
                />
                <Text style={styles.marcaDetalhe}>{produtoSelecionado.marca}</Text>
                <Text style={styles.nomeDetalhe}>{produtoSelecionado.nome}</Text>
                <Text style={styles.precoDetalhe}>R$ {produtoSelecionado.preco.toFixed(2)}</Text>
                <ScrollView style={styles.scrollDescricao}>
                  <Text style={styles.labelDescricao}>Sobre o equipamento:</Text>
                  <Text style={styles.textoDescricao}>{produtoSelecionado.descricao || "Sem descrição disponível."}</Text>
                </ScrollView>
                <TouchableOpacity style={styles.botaoFechar} onPress={() => setModalDetalhesVisible(false)}>
                  <Text style={styles.textoBotaoFechar}>FECHAR</Text>
                </TouchableOpacity>
              </>
            )}
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
  
  // ESTILO DA BARRA DE PESQUISA
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    marginHorizontal: 20, marginBottom: 15, paddingHorizontal: 15, height: 45,
    borderRadius: 25, borderWidth: 1, borderColor: '#ddd', elevation: 2
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },

  lista: { paddingHorizontal: 20, paddingBottom: 100 },
  textoVazio: { textAlign: 'center', marginTop: 50, color: '#aaa' },
  fab: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 30, backgroundColor: '#d35400', borderRadius: 30, elevation: 8 },
  
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.6)' },
  modalView: { width: '90%', backgroundColor: "white", borderRadius: 20, padding: 25, elevation: 5 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  areaFoto: { alignItems: 'center', marginBottom: 15 },
  fotoPreview: { width: '100%', height: 150, borderRadius: 10, resizeMode: 'cover' },
  fotoPlaceholder: { width: '100%', height: 120, backgroundColor: '#f0f0f0', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' },
  input: { backgroundColor: '#f9f9f9', padding: 12, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputMetade: { width: '48%' },
  botoesModal: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },

  modalViewDetalhes: { width: '85%', backgroundColor: "white", borderRadius: 20, padding: 0, elevation: 10, overflow: 'hidden', alignItems: 'center' },
  fotoDetalhe: { width: '100%', height: 250, resizeMode: 'cover' },
  marcaDetalhe: { fontSize: 14, color: '#7f8c8d', textTransform: 'uppercase', marginTop: 15, fontWeight: 'bold' },
  nomeDetalhe: { fontSize: 22, color: '#2c3e50', fontWeight: 'bold', textAlign: 'center', marginHorizontal: 10 },
  precoDetalhe: { fontSize: 24, color: '#27ae60', fontWeight: 'bold', marginVertical: 5 },
  scrollDescricao: { width: '100%', paddingHorizontal: 20, maxHeight: 150, marginTop: 10 },
  labelDescricao: { fontWeight: 'bold', color: '#555', marginBottom: 5 },
  textoDescricao: { color: '#666', lineHeight: 20, textAlign: 'justify' },
  botaoFechar: { backgroundColor: '#2c3e50', width: '100%', padding: 15, alignItems: 'center', marginTop: 20 },
  textoBotaoFechar: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});