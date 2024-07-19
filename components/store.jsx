import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './slices/booksSlice';
import preferencesReducer from './slices/preferencesSlice';

const Store = configureStore({
  reducer: {
    books: booksReducer,
    preferences: preferencesReducer,
  },
});

export default Store;
