// app/search.tsx
import React, { useState } from 'react';
import { SafeAreaView, TextInput, Text, StyleSheet, View } from 'react-native';

export default function SearchScreen() {
  const [query, setQuery] = useState(''); // To capture search input

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Search Posts</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={query}
          onChangeText={setQuery}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
  },
});