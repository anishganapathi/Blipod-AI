import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../components/themed-text";

const CATEGORIES = [
  { id: "1", title: "Podcasts", image: "https://picsum.photos/200/200?1" },
  { id: "2", title: "Music", image: "https://picsum.photos/200/200?2" },
  { id: "3", title: "News", image: "https://picsum.photos/200/200?3" },
  { id: "4", title: "Sports", image: "https://picsum.photos/200/200?4" },
  { id: "5", title: "Technology", image: "https://picsum.photos/200/200?5" },
  { id: "6", title: "Lifestyle", image: "https://picsum.photos/200/200?6" },
];

export default function BrowsePage() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText style={styles.header}>🔖 Browse</ThemedText>

        <FlatList
          data={CATEGORIES}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} activeOpacity={0.7}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.overlay} />
              <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // match ProfilePage
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },
  card: {
    width: "48%",
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    position: "absolute",
    bottom: 12,
    left: 12,
  },
});
