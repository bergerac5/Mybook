import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "react-native-paper";
import { fetchBook } from "@/components/redux/bookReducer";

const BookDetail = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const theme = useTheme(); // Use the theme

  useEffect(() => {
    const getBook = async () => {
      try {
        const book = await dispatch(fetchBook(bookId)).unwrap();
        setBook(book);
      } catch (error) {
        console.error('Failed to fetch book details:', error);
      }
    };

    getBook();
  }, [bookId, dispatch]);

  if (!book) return <Text>Loading...</Text>;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image source={{ uri: book.photoUri }} style={styles.image} />
      <Text style={[styles.title, { color: theme.colors.text }]}>Title: {book.title}</Text>
      <Text style={[styles.author, { color: theme.colors.text }]}>Author: {book.author}</Text>
      <Text style={[styles.status, { color: theme.colors.text }]}>Status: {book.status}</Text>
      <Text style={[styles.rating, { color: theme.colors.text }]}>Rating: {book.rating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: 200, // Increased width
    height: 300, // Increased height
    borderRadius: 10,
    margin: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  author: {
    fontSize: 18,
    marginVertical: 5,
  },
  status: {
    fontSize: 18,
    marginVertical: 5,
  },
  rating: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default BookDetail;
