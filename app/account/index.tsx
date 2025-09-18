import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import GlassNavBar from '../../components/GlassNavBar';

const { width } = Dimensions.get('window');
const STREAK_DAYS = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];


export default function ProfilePage() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const ProfileIcon = () => (
    <Animated.View
      style={[
        styles.profileIconContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <LinearGradient
        colors={['#FF8C00', '#FFA500', '#FF7F00']}
        style={styles.profileIcon}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.soundWaveContainer}>
          {Array.from({ length: 15 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.soundWave,
                {
                  height: Math.random() * 30 + 10,
                  opacity: i === 7 ? 1 : 0.6 + Math.random() * 0.4,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.boltContainer}>
          <MaterialIcons name="bolt" size={24} color="#FFA500" />
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const StreakWidget = () => (
    <Animated.View
      style={[
        styles.streakContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <BlurView style={styles.streakBlur} intensity={30} tint="dark">
        <ThemedView style={styles.streakContent}>
          <View style={styles.streakHeader}>
            <MaterialIcons name="local-fire-department" size={16} color="#FFA500" />
            <ThemedText style={styles.streakText}>0 day streak</ThemedText>
            <MaterialIcons name="local-fire-department" size={16} color="#FFA500" />
          </View>
          
          <View style={styles.daysContainer}>
            {STREAK_DAYS.map((day, index) => (
              <View key={day} style={styles.dayItem}>
                <ThemedText style={styles.dayLabel}>{day}</ThemedText>
                <View style={[
                  styles.dayCircle,
                  index === 3 && styles.activeDayCircle
                ]}>
                  {index === 3 && (
                    <MaterialIcons name="local-fire-department" size={12} color="#FFA500" />
                  )}
                </View>
              </View>
            ))}
          </View>
        </ThemedView>
      </BlurView>
    </Animated.View>
  );

  const ArchiveSection = () => (
    <Animated.View
      style={[
        styles.archiveContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <BlurView style={styles.archiveBlur} intensity={20} tint="dark">
        <TouchableOpacity style={styles.archiveContent}>
          <ThemedText style={styles.archiveText}>Archive</ThemedText>
          <MaterialIcons name="chevron-right" size={24} color="rgba(255, 255, 255, 0.6)" />
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton}>
              <MaterialIcons name="link" size={24} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
            
            <ThemedText style={styles.timeText}>6:46</ThemedText>
            
            <TouchableOpacity style={styles.headerButton}>
              <MaterialIcons name="more-horiz" size={24} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
          </View>

          <View style={styles.mainContent}>
            <ProfileIcon />
            
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <ThemedText style={styles.profileName}>
                Anish's Blipod
              </ThemedText>
            </Animated.View>

            <StreakWidget />
            <ArchiveSection />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* <GlassNavBar activeTab={activeTab} onTabPress={onNavigate} /> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileIconContainer: {
    marginTop: 60,
    marginBottom: 40,
  },
  profileIcon: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  soundWaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  soundWave: {
    width: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 1.5,
    marginHorizontal: 1,
  },
  boltContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
    position: 'absolute',
  },
  profileName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 60,
    textAlign: 'center',
  },
  streakContainer: {
    width: width - 40,
    marginBottom: 20,
  },
  streakBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  streakContent: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginHorizontal: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  dayItem: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    fontWeight: '500',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDayCircle: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  archiveContainer: {
    width: width - 40,
    marginTop: 20,
  },
  archiveBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 28, 30, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  archiveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  archiveText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
});