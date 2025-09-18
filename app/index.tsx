import { Redirect } from 'expo-router';
import GlassNavBar from '@/components/GlassNavBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { View } from 'react-native';
import HomePage from './home';
import AudioPage from './audio';
import BrowsePage from './browse';
import ProfilePage from './account';

export default function Index() {
  return <GlassNavBar />;
}