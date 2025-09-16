import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StoryblokComponentProps } from '../../src/storyblok-expo-sdk/types';

interface FeatureProps extends StoryblokComponentProps {
  blok: {
    name: string;
    [key: string]: any;
  };
}

export default function Feature({ blok }: FeatureProps) {
  return (
    <View style={styles.feature}>
      <Text style={styles.featureName}>{blok.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  feature: {
    backgroundColor: '#007bff',
    padding: 15,
    margin: 5,
    borderRadius: 8,
    flex: 1,
  },
  featureName: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});