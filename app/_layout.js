import { Stack, usePathname, useRouter } from 'expo-router';
import { StoryblokProvider, storyblokInit } from '../src/storyblok-expo-sdk';
import { StyleSheet } from "react-native";
import Page from '../components/storyblok/Page';
import Feature from '../components/storyblok/Feature';
import Grid from '../components/storyblok/Grid';
import Teaser from '../components/storyblok/Teaser';
import Debug from '../components/storyblok/Debug';
// import SplashScreen from "./splash";

// Initialize Storyblok with components
export const getStoryblokApi = storyblokInit({
  config: {
    token: 'wGYSWefGyIK0POAtOZsGawtt',
    version: 'draft',
    region: 'eu',
    debug: true
  },
  components: {
    page: Page,
    feature: Feature,
    grid: Grid,
    teaser: Teaser,
    Debug: Debug,
  }
});

export default function RootLayout() {
  const router = useRouter();

  return (
    <StoryblokProvider
      config={{
        token: 'wGYSWefGyIK0POAtOZsGawtt',
        version: 'draft',
        region: 'eu',
        debug: true
      }}
      storySlug="home"
      router={router}
      components={getStoryblokApi.getComponents()}
    >
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="index" />
        <Stack.Screen name="account" />
      </Stack>
    </StoryblokProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
