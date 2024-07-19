import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookList({ navigation }) {
  const theme = useTheme(); // Access the current theme's colors
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem('bookStorage');
        if (storedBooks) {
          setBooks(JSON.parse(storedBooks));
        }
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
      left={props => <List.Icon {...props} icon="book" color={theme.colors.text} />} // Apply theme-based icon color
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
});
