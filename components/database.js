import * as SQLite from 'expo-sqlite';


const database_name = "BookDB.db";

// Function to get a connection to the database
export const getDBConnection = async () => {
    try {
        const db = SQLite.openDatabaseAsync(database_name); // Ensure this matches your version
        console.log('Database opened successfully');
        return db;
    } catch (error) {
        console.error('Failed to open database:', error);
        throw error;
    }
};


// Function to initialize the database and create the table
export const createTable = async (db) => {
    try {
        // Execute SQL command to create the table and set the journal mode
         db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS Books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                rating INTEGER NOT NULL,
                status TEXT NOT NULL
            );
        `);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Failed to create table:', error);
        throw error;
    }
};

// Function to get all books from the database
export const getBooks = async (db) => {
    try {
        const books = await db.getAllAsync('SELECT * FROM Books');
        return books;
    } catch (error) {
        console.error('Failed to get books:', error);
        throw error;
    }
    
};

// Function to save a new book to the database
export const saveBook = async (db, book) => {
    try {
        const result = await db.runAsync('INSERT INTO Books (title, author, rating, status) VALUES (?, ?, ?, ?)', [book.title, book.author, book.rating, book.status]);
        console.log('Book saved successfully with ID:', result.lastInsertRowId);
    } catch (error) {
        console.error('Failed to save book:', error);
        throw error;
    }
};

// Function to update an existing book in the database
export const updateBook = async (db, book) => {
    try {
      const { id, title, author, rating, status } = book;
      await db.runAsync(
        'UPDATE Books SET title = ?, author = ?, rating = ?, status = ? WHERE id = ?',
        [title, author, rating, status, id]
      );
      console.log('Book updated successfully');
    } catch (error) {
      console.error('Failed to update book:', error);
      throw error;
    }
};

// Function to delete a book from the database
export const deleteBook = async (db, id) => {
    try {
        await db.runAsync('DELETE FROM Books WHERE id = ?', [id]);
        console.log('Book deleted successfully');
    } catch (error) {
        console.error('Failed to delete book:', error);
        throw error;
    }
};

// // Usage example
// (async () => {
//     const db = await getDBConnection();
//     await createTable(db);

//     // Sample operations
//     await saveBook(db, { title: 'Sample Book', author: 'Author Name', rating: 5, status: 'Read' });
//     const books = await getBooks(db);
//     console.log(books);

//     // Update a book
//     await updateBook(db, books[0].id, { title: 'Updated Title', author: 'Updated Author', rating: 4, status: 'Reading' });

//     // Delete a book
//     await deleteBook(db, books[0].id);
// })();