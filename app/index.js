import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useStoryblokStory } from '../src/storyblok-expo-sdk';

export default function HomePage() {
  const { 
    story, 
    isLoading, 
    error, 
    isInEditor, 
    renderContent 
  } = useStoryblokStory('home');

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading home content...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* This will render the 'home' story content */}
      {renderContent()}
      
      {/* Debug info */}
      {__DEV__ && (
        <View style={styles.debugSection}>
          <Text style={styles.debugTitle}>Home Page Debug</Text>
          <Text>Story: {story?.name || 'Not found'}</Text>
          <Text>Slug: home</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
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
  },
});
