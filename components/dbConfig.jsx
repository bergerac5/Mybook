import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'books.db', location: 'default' });

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, rating INTEGER, read INTEGER);'
    );
  });
};

export const addBook = (book) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO books (title, author, rating, read) VALUES (?, ?, ?, ?)',
      [book.title, book.author, book.rating, book.read]
    );
  });
};

export const getBooks = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM books',
      [],
      (tx, results) => {
        const rows = results.rows;
        let books = [];
        for (let i = 0; i < rows.length; i++) {
          books.push(rows.item(i));
        }
        callback(books);
      }
    );
  });
};

// Implement other CRUD operations similarly
