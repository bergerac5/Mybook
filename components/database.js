import * as SQLite from 'expo-sqlite';


const database_name = "BooksDB.db";
let dbInstance = null;

// Function to get a connection to the database
export const getDBConnection = async () => {
    if (dbInstance) {
        return dbInstance;
    }
    try {
        dbInstance = SQLite.openDatabaseAsync(database_name); // Ensure this matches your version
        console.log('Database opened successfully');
        await createTable(dbInstance);
        return dbInstance;
    } catch (error) {
        console.error('Failed to open database:', error);
        throw error;
    }
};


export const createTable = async () => {
    try {
      const db = await getDBConnection();
      db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS Books (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          author TEXT NOT NULL,
          rating INTEGER NOT NULL,
          status TEXT NOT NULL,
          photoUri TEXT
        );
      `);
      console.log('Table created successfully');
    } catch (error) {
      console.error('Failed to create table:', error);
      throw error;
    }
  };  

// Function to get all books from the database
export const getBooks = async () => {
    
    try {
        const db = await getDBConnection();
        const books = await db.getAllAsync('SELECT * FROM Books');
        return books;
    } catch (error) {
        console.error('Failed to get books:', error);
        throw error;
    }
    
};

// Function to get book from the database by id
export const getBook = async (id) => {
    
  try {
      const db = await getDBConnection();
      const books = await db.getAllAsync('SELECT * FROM Books WHERE id = ?',[id]);
      return books;
  } catch (error) {
      console.error('Failed to get books:', error);
      throw error;
  }
  
};

// Function to save a new book to the database
export const saveBook = async (book) => {
    const { title, author, rating, status, photoUri } = book;
    if (!title || !author || !rating || !status) {
      throw new Error('Title, author, rating, and status are required.');
    }
    const db = await getDBConnection();
    try {
      const result = await db.runAsync('INSERT INTO Books (title, author, rating, status, photoUri) VALUES (?, ?, ?, ?, ?)', [title, author, rating, status, photoUri]);
      console.log('Book saved successfully with ID:', result.lastInsertRowId);
    } catch (error) {
      console.error('Failed to save book:', error);
      throw error;
    }
  };
  
  // Function to update an existing book in the database
  export const updateBook = async (book) => {
    const { id, title, author, rating, status, photoUri } = book;
    if (!id || !title || !author || !rating || !status) {
      throw new Error('ID, title, author, rating, and status are required.');
    }
    const db = await getDBConnection();
    try {
      await db.runAsync('UPDATE Books SET title = ?, author = ?, rating = ?, status = ?, photoUri = ? WHERE id = ?', [title, author, rating, status, photoUri, id]);
      console.log('Book updated successfully');
    } catch (error) {
      console.error('Failed to update book:', error);
      throw error;
    }
  };

  export const updateRatingStatus = async (book) => {
    const { id, rating, status } = book;
    if (!id || rating === undefined || status === undefined) {
        throw new Error('ID, rating, and status are required.');
    }

    // Increment rating by 1 and set status to 'Read' if id is not equal to 5
    const newRating = Math.min(id !== 5 ? rating + 1 : rating, 5); // Cap rating at 5
    const newStatus = id !== 5 ? 'read' : status;

    const db = await getDBConnection();
    try {
        await db.runAsync(
            'UPDATE Books SET rating = ?, status = ? WHERE id = ?',
            [newRating, newStatus, id]
        );
        console.log('Book updated successfully');
    } catch (error) {
        console.error('Failed to update book:', error);
        throw error;
    }
};


// Function to delete a book from the database
export const deleteBook = async ( id) => {
    try {
        const db = await getDBConnection();
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