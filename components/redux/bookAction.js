export const setBooks = books => ({
    type: 'SET_BOOKS',
    payload: books,
});

export const saveBook = book => ({
    type: 'ADD_BOOK',
    payload: book,
});

export const updateBook = book => ({
    type: 'UPDATE_BOOK',
    payload: book,
});

export const deleteBook = bookId => ({
    type: 'DELETE_BOOK',
    payload: bookId,
});

export const setSortingPreference = preference => ({
    type: 'SET_SORTING_PREFERENCE',
    payload: preference,
});

export const setSearchQuery = query => ({
    type: 'SET_SEARCH_QUERY',
    payload: query,
});