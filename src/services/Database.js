import * as SQLite from 'expo-sqlite';

// Abre (ou cria) o banco de dados 'vintage.db'
const db = SQLite.openDatabase('vintage.db');

export const initDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS produtos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          marca TEXT NOT NULL,
          preco REAL,
          descricao TEXT
        );`,
        [],
        () => resolve(),
        (_, err) => reject(err)
      );
    });
  });
};

export const adicionarProduto = (nome, marca, preco, descricao) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO produtos (nome, marca, preco, descricao) VALUES (?, ?, ?, ?)',
        [nome, marca, preco, descricao],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const buscarProdutos = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM produtos',
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, err) => reject(err)
      );
    });
  });
};