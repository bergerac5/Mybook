import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import { getDBConnection, getBooks } from '@/components/database';

export default function BookList({ navigation }) {
  const theme = useTheme(); // Access the current theme's colors
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const db = await getDBConnection();
        const storedBooks = await getBooks(db);
        setBooks(storedBooks);
      } catch (error) {
        console.log(error);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadBooks();
    });

    return unsubscribe;
  }, [navigation]);

  const navigateToBookDetails = (item) => {
    navigation.navigate('Detail', { book: item }); // Navigate to 'Detail' screen with book details
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      description={item.author}
      onPress={() => navigateToBookDetails(item)} // Pass the book item to navigateToBookDetails
      titleStyle={{ color: theme.colors.text }} // Apply theme-based text color
      descriptionStyle={{ color: theme.colors.text }} // Apply theme-based text color
      style={[styles.item, { backgroundColor: theme.colors.surface }]} // Apply theme-based background color
      left={props => (
        item.photoUri ? (
          <Image
            source={{ uri: item.photoUri }}
            style={styles.image}
          />
        ) : (
          <List.Icon {...props} icon="book" color={theme.colors.text} />
        )
      )} // Display photo if available, otherwise display icon
    />
  );

  return (
    
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 10,
  },
  item: {
    marginVertical: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});
