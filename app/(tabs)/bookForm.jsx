import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput as PaperTextInput, Button as PaperButton, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookForm = ({ navigation }) => {
  const theme = useTheme(); // Access the current theme's colors
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('');
  const [status, setStatus] = useState('');

  const save = async () => {
    if (title.length < 3) {
      alert("Book title must have at least 3 characters.");
    } else if (author.length < 3) {
      alert("Author name must have at least 3 characters.");
    } else if (rating.length === 0) {
      alert("Book rating cannot be empty.");
    } else if (status.length === 0) {
      alert("Book status cannot be empty.");
    } else {
      try {
        const book = { title, author, rating, status };
        const storedBooks = await AsyncStorage.getItem('bookStorage');
        const books = storedBooks ? JSON.parse(storedBooks) : [];
        books.push(book);
        await AsyncStorage.setItem('bookStorage', JSON.stringify(books));
        navigation.navigate('Home');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PaperTextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { text: theme.colors.text, primary: theme.colors.primary } }}
      />
      <PaperTextInput
        label="Author"
        value={author}
        onChangeText={setAuthor}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { text: theme.colors.text, primary: theme.colors.primary } }}
      />
      <PaperTextInput
        label="Rate"
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { text: theme.colors.text, primary: theme.colors.primary } }}
      />
      <PaperTextInput
        label="Status"
        value={status}
        onChangeText={setStatus}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { text: theme.colors.text, primary: theme.colors.primary } }}
      />
      <PaperButton
        mode="contained"
        onPress={save}
        style={styles.button}
        theme={{ colors: { primary: theme.colors.primary } }}
      >
        Save
      </PaperButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default BookForm;
