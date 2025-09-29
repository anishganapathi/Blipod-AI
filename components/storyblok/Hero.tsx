import React from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { StoryblokComponentProps } from '../../src/storyblok-expo-sdk/types';

interface FeatureProps extends StoryblokComponentProps {
    blok: {
        image?: string;
    };
    onNavigateToAudio?: () => void;
}

export default function Feature({ blok, onNavigateToAudio }: FeatureProps) {
    const handleRecentlySavedSeeAll = () => {
        onNavigateToAudio?.();
    };

    return (
        <Image
            source={{
                uri: blok.image?.startsWith('http')
                    ? blok.image
                    : `https:${blok.image}`,
            }}
            style={styles.heroImage}
        />
    );
}



const styles = StyleSheet.create({
    heroImage: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
    },
});