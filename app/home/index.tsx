import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PlayIcon = () => (
  <View style={styles.playIcon}>
    <Text style={styles.playIconText}>▶</Text>
  </View>
);

const MoreIcon = () => (
  <View style={styles.moreIcon}>
    <Text style={styles.moreIconText}>⋯</Text>
  </View>
);

const Homepage = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.podcastTitle}>Anish's txtpod</Text>

            <View style={styles.podcastInfo}>
              <Text style={styles.episodeCount}>1 episodes</Text>
              <Text style={styles.lastUpdate}>Last update 4 days ago</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.playButton}>
                <PlayIcon />
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.moreButton}>
                <MoreIcon />
              </TouchableOpacity>
            </View>
          </View>

          {/* Episode List Section */}
          <View style={styles.episodeSection}>
            <View style={styles.episodeItem}>
              <View style={styles.bbcLogo}>
                <Text style={styles.bbcText}>BBC</Text>
                <Text style={styles.sportText}>SPORT</Text>
              </View>

              <View style={styles.episodeContent}>
                <Text style={styles.episodeTitle}>
                  Cricket – Test, T20 & ODI news, scores & results – BBC Sport
                </Text>
                <View style={styles.episodeDetails}>
                  <Text style={styles.episodeDate}>13th September 12:56 AM</Text>
                  <Text style={styles.playedStatus}>Played</Text>
                </View>
              </View>
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
    backgroundColor: '#000', // critical
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#D97636',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    width: '100%',
  },
  podcastTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  podcastInfo: {
    marginBottom: 24,
  },
  episodeCount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  lastUpdate: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 16,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  moreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  moreIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  episodeSection: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 24,
    width: '100%',
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  bbcLogo: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 16,
    marginTop: 2,
    minWidth: 40,
  },
  bbcText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sportText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#D97636',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  episodeContent: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 8,
    fontWeight: '400',
  },
  episodeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  episodeDate: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  playedStatus: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default Homepage;
