import * as SQLite from 'expo-sqlite';

// Na versão nova, usamos 'openDatabaseSync'
const db = SQLite.openDatabaseSync('vintage.db');

export const initDB = async () => {
  // execAsync é o novo jeito de rodar comandos de estrutura (CREATE TABLE)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      marca TEXT NOT NULL,
      preco REAL,
      descricao TEXT
    );
  `);
};

export const adicionarProduto = async (nome, marca, preco, descricao) => {
  // runAsync é para INSERT, UPDATE, DELETE
  const result = await db.runAsync(
    'INSERT INTO produtos (nome, marca, preco, descricao) VALUES (?, ?, ?, ?)',
    [nome, marca, preco, descricao]
  );
  return result;
};

export const buscarProdutos = async () => {
  // getAllAsync traz todas as linhas de uma vez (substitui o antigo transaction)
  const allRows = await db.getAllAsync('SELECT * FROM produtos');
  return allRows;
};

export const removerProduto = async (id) => {
  await db.runAsync('DELETE FROM produtos WHERE id = ?', [id]);
};

export const atualizarProduto = async (id, nome, marca, preco, descricao) => {
  await db.runAsync(
    'UPDATE produtos SET nome = ?, marca = ?, preco = ?, descricao = ? WHERE id = ?',
    [nome, marca, preco, descricao, id]
  );
};