import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput as PaperTextInput, Button as PaperButton, useTheme } from 'react-native-paper';
import { getDBConnection, saveBook, updateBook } from '@/components/database';

const BookForm = ({ navigation, route }) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('');
  const [status, setStatus] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [bookId, setBookId] = useState(null);

  useEffect(() => {
    if (route.params && route.params.book) {
      const { book } = route.params;
      if (book) {
        setTitle(book.title || '');
        setAuthor(book.author || '');
        setRating(book.rating ? book.rating.toString() : '');
        setStatus(book.status || '');
        setBookId(book.id);
        setIsEdit(true);
      }
    }
  }, [route.params]);

  const confirmSave = () => {
    Alert.alert(
      "Confirm Save",
      "Are you sure you want to save this book?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: saveBookData }
      ]
    );
  };

  const confirmUpdate = () => {
    Alert.alert(
      "Confirm Update",
      "Are you sure you want to update this book?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: saveBookData }
      ]
    );
  };

  const saveBookData = async () => {
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
        const book = { id: bookId, title, author, rating, status };
        if (isEdit) {
          if (bookId) {
            await updateBook(book);
          } else {
            console.error('Book ID is missing');
            alert('Failed to update book. Book ID is missing.');
          }
        } else {
          await saveBook({ title, author, rating, status });
        }
        // Clear input fields and reset state
        setTitle('');
        setAuthor('');
        setRating('');
        setStatus('');
        setBookId(null);
        setIsEdit(false);
        navigation.navigate('Home');
      } catch (error) {
        console.error('Failed to save or update book:', error);
        alert('An error occurred while saving the book. Please try again.');
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PaperTextInput
        label="Book ID"
        value={bookId ? bookId.toString() : ''}
        editable={false}
        style={[styles.input, { height: 0, width: 0, opacity: 0 }]} // Hide input visually
        theme={{ colors: { text: theme.colors.text, primary: theme.colors.primary } }}
      />
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
        onPress={isEdit ? confirmUpdate : confirmSave}
        style={styles.button}
        theme={{ colors: { primary: theme.colors.primary } }}
      >
        {isEdit ? 'Update' : 'Save'}
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
