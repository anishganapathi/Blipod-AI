// app/account.tsx - Account Page
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useStoryblokStory } from "@/src/storyblok-expo-sdk";
import { useRouter } from "expo-router";

export default function AccountScreen() {
  const router = useRouter();
  const {
    story,
    isLoading,
    error,
    isInEditor,
    renderContent
  } = useStoryblokStory('account');

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading account content...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error loading account: {error}</Text>
        {/* Fallback content */}
        <View style={styles.fallbackContainer}>
          <Text style={styles.title}>Account Page</Text>
          <Text style={styles.subtitle}>Story not found. Using fallback content.</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={{ fontSize: 16 }}>← Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* This will render the 'account' story content */}
      {renderContent()}

      {/* Navigation */}
      <View style={styles.navigationSection}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 16 }}>← Back</Text>
        </Pressable>
      </View>

      {/* Debug info */}
      {__DEV__ && (
        <View style={styles.debugSection}>
          <Text style={styles.debugTitle}>Account Page Debug</Text>
          <Text>Story: {story?.name || 'Not found'}</Text>
          <Text>Slug: account</Text>
          <Text>In Editor: {isInEditor ? 'Yes' : 'No'}</Text>
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fallbackContainer: {
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 8,
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  navigationSection: {
    padding: 20,
    alignItems: 'center',
  },
  link: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  debugSection: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
  },
});