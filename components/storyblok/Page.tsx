import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { StoryblokComponentProps } from '../../src/storyblok-expo-sdk/types';
import { useStoryblok } from '../../src/storyblok-expo-sdk';
import { Link } from 'expo-router';

interface PageProps extends StoryblokComponentProps {
  blok: {
    body: any[];
    [key: string]: any;
  };
}

export default function Page({ blok }: PageProps) {
  const { sdk } = useStoryblok();

  return (
    <View style={styles.page}>
      {/* Render all components in the body array */}
      {blok.body?.map((nestedBlok: any, index: number) => 
        sdk?.renderStoryblokContent(nestedBlok, `page-body-${index}`)
      )}
      <Link href="/account" style={styles.link}>
        <Text>Go to Account</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
