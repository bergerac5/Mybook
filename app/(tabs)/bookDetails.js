import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Alert } from "react-native";
import {
  List,
  Text as PaperText,
  TextInput,
  useTheme,
  IconButton,
  Button,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDBConnection, getBooks, deleteBook } from "@/components/database";
import { Rating } from 'react-native-ratings';

export default function BookDetails({ navigation }) {
  const theme = useTheme();
  const [books, setBooks] = useState([]);
  const [sortingPreference, setSortingPreference] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const db = await getDBConnection();
        const storedBooks = await getBooks(db);
        setBooks(storedBooks);
        sortAndFilterBooks(storedBooks, sortingPreference, searchQuery);
      } catch (error) {
        console.log(error);
      }
    };

    const loadSortingPreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem("sortingPreference");
        if (savedPreference) {
          setSortingPreference(savedPreference);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      loadSortingPreference();
      loadBooks();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    sortAndFilterBooks(books, sortingPreference, searchQuery);
  }, [books, sortingPreference, searchQuery]);

  const sortAndFilterBooks = (books, preference, query) => {
    let sortedBooks = [...books];
    if (preference === "title") {
      sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (preference === "author") {
      sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
    } else if (preference === "rating") {
      sortedBooks.sort((a, b) => b.rating - a.rating);
    }

    if (query.length > 0) {
      const lowercasedQuery = query.toLowerCase();
      sortedBooks = sortedBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(lowercasedQuery) ||
          book.author.toLowerCase().includes(lowercasedQuery) ||
          book.status.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredBooks(sortedBooks);
  };

  const saveSortingPreference = async (preference) => {
    try {
      await AsyncStorage.setItem("sortingPreference", preference);
      setSortingPreference(preference);
    } catch (error) {
      console.log(error);
    }
  };

  const filterBooks = (query) => {
    setSearchQuery(query);
    sortAndFilterBooks(books, sortingPreference, query);
  };

  const handleDelete = async (id) => {
    try {
      const db = await getDBConnection();
      await deleteBook(id);
      const updatedBooks = books.filter((book) => book.id !== id);
      setBooks(updatedBooks);
      sortAndFilterBooks(updatedBooks, sortingPreference, searchQuery);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => handleDelete(id) },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={`Title: ${item.title}`}
      description={`Author: ${item.author}`}
      left={() => <List.Icon icon="book" color={theme.colors.text} />}
      right={() => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Rating
              type='star'
              ratingCount={5}
              imageSize={20}
              startingValue={item.rating}
              readonly
              style={styles.rating}
            />
            <PaperText
              style={{
                color: item.status === 'unread' ? 'red' : 'blue',
                marginVertical: 5,
              }}
            >
              Status: {item.status}
            </PaperText>
          </View>
          <IconButton
            icon="pencil"
            color={theme.colors.text}
            onPress={() => navigation.navigate('Edit', { book: item })}
          />
          <IconButton
            icon="delete"
            color={theme.colors.text}
            onPress={() => confirmDelete(item.id)}
          />
        </View>
      )}
      style={{ backgroundColor: theme.colors.background }}
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TextInput
        label="Search"
        value={searchQuery}
        onChangeText={filterBooks}
        style={styles.searchBar}
        theme={{
          colors: { text: theme.colors.text, primary: theme.colors.primary },
        }}
      />
      <View style={styles.sortingButtons}>
        <Button mode="contained" onPress={() => saveSortingPreference("title")}>
          Sort by Title
        </Button>
        <Button
          mode="contained"
          onPress={() => saveSortingPreference("author")}
        >
          Sort by Author
        </Button>
        <Button
          mode="contained"
          onPress={() => saveSortingPreference("rating")}
        >
          Sort by Rating
        </Button>
      </View>
      <FlatList
        data={filteredBooks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sortingButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
  },
  searchBar: {
    margin: 10,
  },
  rating: {
    marginVertical: 5,
  },
});
