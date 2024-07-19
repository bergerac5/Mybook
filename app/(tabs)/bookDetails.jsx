import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { List, Text as PaperText, TextInput, useTheme } from 'react-native-paper';

export default function BookDetails({ navigation }) {
    const theme = useTheme(); // Access the current theme's colors
    const [books, setBooks] = useState([]);
    const [sortingPreference, setSortingPreference] = useState('title');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const storedBooks = await AsyncStorage.getItem('bookStorage');
                if (storedBooks) {
                    const parsedBooks = JSON.parse(storedBooks);
                    sortBooks(parsedBooks, sortingPreference);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const loadSortingPreference = async () => {
            try {
                const savedPreference = await AsyncStorage.getItem('sortingPreference');
                if (savedPreference) {
                    setSortingPreference(savedPreference);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const unsubscribe = navigation.addListener('focus', () => {
            loadSortingPreference();
            loadBooks();
        });

        return unsubscribe;
    }, [navigation]);

    const sortBooks = (books, preference) => {
        let sortedBooks = [...books];
        if (preference === 'title') {
            sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
        } else if (preference === 'author') {
            sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
        } else if (preference === 'rating') {
            sortedBooks.sort((a, b) => b.rating - a.rating);
        }
        setBooks(sortedBooks);
        setFilteredBooks(sortedBooks);
    };

    const saveSortingPreference = async (preference) => {
        try {
            await AsyncStorage.setItem('sortingPreference', preference);
            setSortingPreference(preference);
            sortBooks(books, preference);
        } catch (error) {
            console.log(error);
        }
    };

    const filterBooks = (query) => {
        setSearchQuery(query);
        if (query.length === 0) {
            setFilteredBooks(books);
        } else {
            const lowercasedQuery = query.toLowerCase();
            const filtered = books.filter(book =>
                book.title.toLowerCase().includes(lowercasedQuery) ||
                book.author.toLowerCase().includes(lowercasedQuery) ||
                book.status.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredBooks(filtered);
        }
    };

    const renderItem = ({ item }) => (
        <List.Item
            title={`Title: ${item.title}`}
            description={`Author: ${item.author}`}
            left={() => <List.Icon icon="book" color={theme.colors.text} />}
            right={() => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <PaperText style={{ color: theme.colors.text }}>Rating: {item.rating}/5</PaperText>
                    <PaperText style={{ color: theme.colors.text }}>Status: {item.status}</PaperText>
                </View>
            )}
            style={{ backgroundColor: theme.colors.background }}
        />
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <TextInput
                label="Search"
                value={searchQuery}
                onChangeText={filterBooks}
                style={styles.searchBar}
                theme={{ colors: { text: theme.colors.text, primary: theme.colors.primary } }}
            />
            <View style={styles.sortingButtons}>
                <Button title="Sort by Title" onPress={() => saveSortingPreference('title')} />
                <Button title="Sort by Author" onPress={() => saveSortingPreference('author')} />
                <Button title="Sort by Rating" onPress={() => saveSortingPreference('rating')} />
            </View>
            <FlatList
                data={filteredBooks}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={{ color: theme.colors.text }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sortingButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
    },
    searchBar: {
        margin: 10,
    },
});
