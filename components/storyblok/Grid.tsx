import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StoryblokComponentProps } from '../../src/storyblok-expo-sdk/types';
import { useStoryblok } from '../../src/storyblok-expo-sdk';

interface GridProps extends StoryblokComponentProps {
  blok: {
    columns: any[];
    [key: string]: any;
  };
}

export default function Grid({ blok }: GridProps) {
  const { sdk } = useStoryblok();

  return (
    <View style={styles.grid}>
      {blok.columns?.map((column: any, index: number) => 
        <View key={column._uid || index} style={styles.gridColumn}>
          {sdk?.renderStoryblokContent(column, `grid-column-${index}`)}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  gridColumn: {
    flex: 1,
    minWidth: '30%',
  },
});
