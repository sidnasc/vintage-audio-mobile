import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('vintage.db');

export const initDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      marca TEXT NOT NULL,
      preco REAL,
      descricao TEXT,
      imagem TEXT  -- Nova coluna para o caminho da foto
    );
  `);
};

export const adicionarProduto = async (nome, marca, preco, descricao, imagem) => {
  const result = await db.runAsync(
    'INSERT INTO produtos (nome, marca, preco, descricao, imagem) VALUES (?, ?, ?, ?, ?)',
    [nome, marca, preco, descricao, imagem]
  );
  return result;
};

export const atualizarProduto = async (id, nome, marca, preco, descricao, imagem) => {
  await db.runAsync(
    'UPDATE produtos SET nome = ?, marca = ?, preco = ?, descricao = ?, imagem = ? WHERE id = ?',
    [nome, marca, preco, descricao, imagem, id]
  );
};

export const removerProduto = async (id) => {
  await db.runAsync('DELETE FROM produtos WHERE id = ?', [id]);
};

export const buscarProdutos = async () => {
  const allRows = await db.getAllAsync('SELECT * FROM produtos');
  return allRows;
};