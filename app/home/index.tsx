import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface PodcastCard {
  id: string;
  title: string;
  publisher: string;
  image: string;
}

interface Episode {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  duration: string;
  thumbnail: string;
}

const Homepage = () => {
  const podcasts: PodcastCard[] = [
    {
      id: '1',
      title: 'Dare We Say',
      publisher: 'truth.media',
      image: 'https://picsum.photos/200/200?1',
    },
    {
      id: '2',
      title: 'Missed Fortune',
      publisher: 'audiocheck',
      image: 'https://picsum.photos/200/200?2',
    },
    {
      id: '3',
      title: 'Tech Talk',
      publisher: 'techcast',
      image: 'https://picsum.photos/200/200?3',
    },
    {
      id: '4',
      title: 'Story Time',
      publisher: 'narratives',
      image: 'https://picsum.photos/200/200?4',
    },
  ];

  const episodes: Episode[] = [
    {
      id: '1',
      title: 'The Drug Runner I',
      subtitle: 'Chapter 1',
      date: 'Monday 11 Aug, 2022',
      duration: '20 min',
      thumbnail: 'https://picsum.photos/150/150?5',
    },
    {
      id: '2',
      title: 'Breaking News',
      subtitle: 'Episode 15',
      date: 'Tuesday 12 Aug, 2022',
      duration: '25 min',
      thumbnail: 'https://picsum.photos/150/150?6',
    },
    {
      id: '3',
      title: 'Morning Brief',
      subtitle: 'Daily Update',
      date: 'Wednesday 13 Aug, 2022',
      duration: '15 min',
      thumbnail: 'https://picsum.photos/150/150?7',
    },
  ];

  const PodcastCard = ({ item }: { item: PodcastCard }) => (
    <TouchableOpacity style={styles.podcastCard} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.podcastImage} />
      <View style={styles.podcastOverlay}>
        <Text style={styles.podcastTitle}>{item.title}</Text>
        <Text style={styles.podcastPublisher}>{item.publisher}</Text>
      </View>
    </TouchableOpacity>
  );

  const EpisodeItem = ({ item }: { item: Episode }) => (
    <TouchableOpacity style={styles.episodeItem} activeOpacity={0.8}>
      <Image source={{ uri: item.thumbnail }} style={styles.episodeThumbnail} />
      <View style={styles.episodeContent}>
        <Text style={styles.episodeTitle}>{item.title}</Text>
        <Text style={styles.episodeSubtitle}>{item.subtitle}</Text>
        <Text style={styles.episodeDate}>{item.date}</Text>
      </View>
      <View style={styles.episodeActions}>
        <MaterialIcons name="play-circle-outline" size={24} color="#FFA500" />
        <Text style={styles.episodeDuration}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.profileContainer}>
                <View style={styles.profileImage}>
                  <MaterialIcons name="person" size={24} color="#fff" />
                </View>
                <View style={styles.profileText}>
                  <Text style={styles.welcomeText}>Welcome Anish!</Text>
                  <Text style={styles.exploreText}>Explore Podcasts</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.searchButton}>
              <MaterialIcons name="search" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* New Podcasts Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New Podcasts</Text>
            <View style={styles.categoryButtons}>
              <TouchableOpacity style={styles.categoryButton}>
                <LinearGradient
                  colors={['#FF8C00', '#FFA500']}
                  style={styles.categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.categoryText}>Trending</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.categoryButton}>
                <LinearGradient
                  colors={['#FFA500', '#FF7F00']}
                  style={styles.categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.categoryText}>Bingeworthy</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.categoryButton}>
                <LinearGradient
                  colors={['#FF7F00', '#FF8C00']}
                  style={styles.categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.categoryText}>Award</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* New & Noteworthy Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New & Noteworthy</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={podcasts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <PodcastCard item={item} />}
              contentContainerStyle={styles.podcastList}
            />
          </View>

          {/* Top Episodes Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Episodes</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.episodesList}>
              {episodes.map((episode) => (
                <EpisodeItem key={episode.id} item={episode} />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerLeft: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  exploreText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: '500',
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  podcastList: {
    paddingRight: 24,
  },
  podcastCard: {
    width: 160,
    height: 160,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  podcastImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  podcastOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
  },
  podcastTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  podcastPublisher: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  episodesList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  episodeThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  episodeContent: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  episodeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  episodeDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  episodeActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeDuration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
});

export default Homepage;