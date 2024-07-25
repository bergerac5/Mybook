import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Image,
  TouchableWithoutFeedback, Keyboard
} from "react-native";
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
  useTheme,
} from "react-native-paper";
import { useDispatch, useSelector } from 'react-redux';
import { addBook, updateBook } from '@/components/redux/bookReducer';
import { Rating } from "react-native-ratings";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";

const BookForm = ({ navigation, route }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("unread");
  const [photoUri, setPhotoUri] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [bookId, setBookId] = useState(null);

  useEffect(() => {
    if (route.params && route.params.book) {
      const { book } = route.params;
      if (book) {
        setTitle(book.title || "");
        setAuthor(book.author || "");
        setRating(book.rating || 0);
        setStatus(book.status || "unread");
        setPhotoUri(book.photoUri || null);
        setBookId(book.id || null); // Ensure bookId is set to null if not provided
        setIsEdit(true);
      }
    }
  }, [route.params]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 6],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const confirmSave = () => {
    Alert.alert("Confirm Save", "Are you sure you want to save this book?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: saveBookData },
    ]);
  };

  const confirmUpdate = () => {
    Alert.alert(
      "Confirm Update",
      "Are you sure you want to update this book?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: saveBookData },
      ]
    );
  };

   saveBookData = async () => {
    if (title.length < 3) {
      alert("Book title must have at least 3 characters.");
    } else if (author.length < 3) {
      alert("Author name must have at least 3 characters.");
    } else {
      try {
        // Log bookId to check its value
        console.log("Saving book with ID:", bookId);
  
        // Ensure bookId is defined before using it
        const book = {
          id: bookId || null, // Set id to null if bookId is undefined
          title,
          author,
          rating,
          status,
          photoUri,
        };
  
        if (isEdit) {
          if (bookId) {
            await dispatch(updateBook(book)).unwrap();
          } else {
            console.error("Book ID is missing");
            alert("Failed to update book. Book ID is missing.");
          }
        } else {
          await dispatch(addBook({ title, author, rating, status, photoUri })).unwrap();
        }
  
        // Reset form after saving/updating
        setTitle("");
        setAuthor("");
        setRating(0);
        setStatus("unread");
        setPhotoUri(null);
        setBookId(null);
        setIsEdit(false);
  
        // Navigate to Home
        navigation.navigate("Home");
      } catch (error) {
        console.error("Failed to save or update book:", error);
        alert("An error occurred while saving the book. Please try again.");
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <PaperTextInput
          label="Book ID"
          value={bookId != null ? bookId.toString() : ""}
          editable={false}
          style={[styles.input, { height: 0, width: 0, opacity: 0 }]}
          theme={{
            colors: { text: theme.colors.text, primary: theme.colors.primary },
          }}
        />
        <PaperTextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: { text: theme.colors.text, primary: theme.colors.primary },
          }}
        />
        <PaperTextInput
          label="Author"
          value={author}
          onChangeText={setAuthor}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: { text: theme.colors.text, primary: theme.colors.primary },
          }}
        />
        <View style={styles.checkboxContainer}>
          <Text style={{ color: theme.colors.text }}>Status</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: theme.colors.text }}>Read</Text>
            <Checkbox
              value={status === "read"}
              onValueChange={(newValue) =>
                setStatus(newValue ? "read" : "unread")
              }
              color={theme.colors.primary}
            />
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={{ color: theme.colors.text }}>Rating</Text>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={30}
            startingValue={rating}
            onFinishRating={setRating}
            style={styles.rating}
          />
        </View>
        <PaperButton
          mode="contained"
          onPress={pickImage}
          style={styles.button}
          theme={{ colors: { primary: theme.colors.primary } }}
        >
          {photoUri ? "Change Photo" : "Add Photo"}
        </PaperButton>
        {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}
        <PaperButton
          mode="contained"
          onPress={isEdit ? confirmUpdate : confirmSave}
          style={styles.button}
          theme={{ colors: { primary: theme.colors.primary } }}
        >
          {isEdit ? "Update" : "Save"}
        </PaperButton>
      </View>
    </TouchableWithoutFeedback>
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
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    height: 50
  },
  ratingContainer: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    alignSelf: "center",
  },
  button: {
    marginTop: 16,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginVertical: 16,
  },
});

export default BookForm;