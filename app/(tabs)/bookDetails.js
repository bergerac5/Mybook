import React, { useEffect } from "react";
import { StyleSheet, View, FlatList, Alert, Image } from "react-native";
import {
  List,
  Text as PaperText,
  TextInput,
  useTheme,
  IconButton,
  Button,
} from "react-native-paper";
import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks, setSortingPreference, setSearchQuery, deleteBook } from '@/components/redux/bookReducer';
import { Rating } from 'react-native-ratings';

export default function BookDetails({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const filteredBooks = useSelector((state) => state.books.filteredBooks);
  const sortingPreference = useSelector((state) => state.books.sortingPreference);
  const searchQuery = useSelector((state) => state.books.searchQuery || ""); // Ensure default value
  const loading = useSelector((state) => state.books.loading);

  useEffect(() => {
    const loadBooks = () => {
      dispatch(fetchBooks());
    };

    loadBooks();
    const unsubscribe = navigation.addListener("focus", () => {
      loadBooks();
    });

    return unsubscribe;
  }, [dispatch, navigation]);

  useEffect(() => {
    dispatch(setSearchQuery(searchQuery));
  }, [searchQuery, dispatch]);

  const saveSortingPreference = (preference) => {
    dispatch(setSortingPreference(preference));
  };

  const filterBooks = (query) => {
    dispatch(setSearchQuery(query));
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteBook(id)).unwrap();
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
      left={() => (
        <View style={styles.leftContainer}>
          {item.photoUri ? (
            <Image
              source={{ uri: item.photoUri }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <List.Icon icon="book" color={theme.colors.text} />
          )}
          <View style={styles.infoContainer}>
            <PaperText style={styles.titleText}>Title: {item.title}</PaperText>
            <PaperText style={styles.authorText}>Author: {item.author}</PaperText>
            <PaperText style={[
              styles.statusText,
              { color: item.status === 'unread' ? 'red' : 'blue' }
            ]}>
              Status: {item.status}
            </PaperText>
            <Rating
              type='star'
              ratingCount={5}
              imageSize={20}
              startingValue={item.rating}
              readonly
              style={styles.rating}
            />
          </View>
        </View>
      )}
      right={() => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton
            icon="pencil"
            color="#00ffff" // Aqua color for edit icon
            onPress={() => navigation.navigate('Edit', { book: item })}
          />
          <IconButton
            icon="delete"
            color="#ff0000" // Red color for delete icon
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
        ListEmptyComponent={<PaperText>No books available</PaperText>}
        refreshing={loading}
        onRefresh={() => dispatch(fetchBooks())}
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
  image: {
    width: 200,   // Increased width
    height: 300,  // Increased height
    borderRadius: 10, // Optional: increased border radius for rounded corners
    margin: 5,
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    marginTop: 10, // Space between the image and text
    alignItems: 'center',
  },
  titleText: {
    fontWeight: 'bold',
  },
  authorText: {
    color: 'gray',
  },
  statusText: {
    marginVertical: 5,
  },
});
