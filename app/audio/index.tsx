import React, { useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../components/themed-text";
import Icon from "../../components/LucideIcons";

const TRACKS = [
  { id: "1", title: "Lofi Beats", artist: "DJ Chill" },
  { id: "2", title: "Focus Mode", artist: "Study Vibes" },
  { id: "3", title: "Night Walk", artist: "Calm Collective" },
];

export default function AudioPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Now Playing Section */}
        <View style={styles.nowPlaying}>
          <Icon name="Headphones" size={60} color="#fff" />
          <ThemedText style={styles.trackTitle}>{currentTrack.title}</ThemedText>
          <ThemedText style={styles.trackArtist}>{currentTrack.artist}</ThemedText>

          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlay}
            activeOpacity={0.7}
          >
            <Icon
              name={isPlaying ? "Pause" : "Play"}
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Playlist */}
        <ThemedText style={styles.sectionHeader}>Playlist</ThemedText>
        <FlatList
          data={TRACKS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.trackItem}
              onPress={() => setCurrentTrack(item)}
            >
              <View>
                <ThemedText style={styles.trackTitleSmall}>{item.title}</ThemedText>
                <ThemedText style={styles.trackArtistSmall}>{item.artist}</ThemedText>
              </View>
              <Icon
                name={
                  currentTrack.id === item.id && isPlaying
                    ? "Volume2"
                    : "Music"
                }
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // black root
  },
  safeArea: {
    flex: 1,
    padding: 20,
  },
  nowPlaying: {
    alignItems: "center",
    marginBottom: 30,
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginTop: 12,
  },
  trackArtist: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 15,
  },
  playButton: {
    marginTop: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1DB954",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  trackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  trackTitleSmall: {
    fontSize: 14,
    color: "#fff",
  },
  trackArtistSmall: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
});
