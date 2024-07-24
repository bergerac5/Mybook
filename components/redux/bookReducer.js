import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as db from '../database';

const initialState = {
    books: [],
    filteredBooks: [],
    sortingPreference: 'title',
    searchQuery: '',
    loading: false,
    error: null,
};

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
    const books = await db.getBooks();
    return books;
});

export const addBook = createAsyncThunk('books/addBook', async (book) => {
    await db.saveBook(book);
    return book;
});

export const updateBook = createAsyncThunk('books/updateBook', async (book) => {
    await db.updateBook(book);
    return book;
});

export const deleteBook = createAsyncThunk('books/deleteBook', async (id) => {
    await db.deleteBook(id);
    return id;
});

const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setSortingPreference: (state, action) => {
            state.sortingPreference = action.payload;
            state.filteredBooks = sortAndFilterBooks(state.books, action.payload, state.searchQuery);
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            state.filteredBooks = sortAndFilterBooks(state.books, state.sortingPreference, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload;
                state.filteredBooks = sortAndFilterBooks(action.payload, state.sortingPreference, state.searchQuery);
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addBook.fulfilled, (state, action) => {
                state.books.push(action.payload);
                state.filteredBooks = sortAndFilterBooks(state.books, state.sortingPreference, state.searchQuery);
            })
            .addCase(updateBook.fulfilled, (state, action) => {
                const index = state.books.findIndex((book) => book.id === action.payload.id);
                if (index !== -1) {
                    state.books[index] = action.payload;
                }
                state.filteredBooks = sortAndFilterBooks(state.books, state.sortingPreference, state.searchQuery);
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.books = state.books.filter((book) => book.id !== action.payload);
                state.filteredBooks = sortAndFilterBooks(state.books, state.sortingPreference, state.searchQuery);
            });
    },
});

const sortAndFilterBooks = (books, preference, query) => {
    let sortedBooks = [...books];
    if (preference === "title") {
        sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (preference === "author") {
        sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
    } else if (preference === "rating") {
        sortedBooks.sort((a, b) => b.rating - a.rating);
    }

    if (query && query.length > 0) {
        const lowercasedQuery = query.toLowerCase();
        sortedBooks = sortedBooks.filter(
            (book) =>
                book.title.toLowerCase().includes(lowercasedQuery) ||
                book.author.toLowerCase().includes(lowercasedQuery) ||
                book.status.toLowerCase().includes(lowercasedQuery)
        );
    }

    return sortedBooks;
};

export const { setSortingPreference, setSearchQuery } = booksSlice.actions;
export default booksSlice.reducer;
