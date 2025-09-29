import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StoryblokComponentProps } from '../../src/storyblok-expo-sdk/types';

interface FeatureProps extends StoryblokComponentProps {
  blok: {
    title?: string;
    sub_title?: string;
    color?: {
      color: string;
    };
  };
  onNavigateToAudio?: () => void;
}

export default function Feature({ blok, onNavigateToAudio }: FeatureProps) {
  const handleRecentlySavedSeeAll = () => {
    onNavigateToAudio?.();
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{blok.title}</Text>

        <TouchableOpacity
          style={styles.rightSection}
          onPress={handleRecentlySavedSeeAll}
        >
          <Text style={styles.seeAllText}>{blok.sub_title}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: '500',
    marginRight: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#fff',
  },
});