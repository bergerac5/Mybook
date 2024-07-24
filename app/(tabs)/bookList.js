import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, ActivityIndicator, Text } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '@/components/redux/bookReducer';

export default function BookList({ navigation }) {
  const theme = useTheme(); // Access the current theme's colors
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);

  useEffect(() => {
    const loadBooks = async () => {
      dispatch(fetchBooks());
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadBooks();
    });

    return unsubscribe;
  }, [dispatch, navigation]);

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

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>{`Error: ${error}`}</Text>
      </View>
    );
  }

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
    justifyContent: 'center',
    alignItems: 'center',
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
