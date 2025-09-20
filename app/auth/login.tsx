import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [loading, setLoading] = useState(false);
  
  // Google Auth Configuration (commented out for testing)
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId: 'YOUR_EXPO_CLIENT_ID.googleusercontent.com',
  //   scopes: ['profile', 'email'],
  //   redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
  // });

  // Temporary test function
  const request = true; // Enable button for testing

  useEffect(() => {
    // handleSignInResponse(); // Commented out for testing
  }, []);

  const handleSignInResponse = async () => {
    // Implementation here when Google auth is configured
  };

  const fetchUserInfo = async (token: string) => {
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    // Simulate Google authentication for testing
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Google Sign-In', 
        'This would open Google authentication!\n\nTo enable real authentication:\n1. Set up Google Console\n2. Add your Client IDs\n3. Uncomment the Google auth code',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const handleGetStarted = () => {
    // Navigate to onboarding or registration
    Alert.alert('Get Started', 'Navigate to registration/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>📦</Text>
          </View>
          <Text style={styles.logoText}>Blipod</Text>
        </View>
      </View>

      {/* Content Cards */}
      <View style={styles.contentContainer}>
        <View style={styles.cardsContainer}>
          {/* Track What You Eat Card */}
          <View style={[styles.card, styles.trackCard]}>
            <Text style={styles.cardIcon}>🎧</Text>
            <Text style={styles.cardText}>Search, Add &{'\n'}Listen</Text>
          </View>

          {/* Reach Your Goals Card */}
          <View style={[styles.card, styles.goalsCard]}>
            <LinearGradient
              colors={['#FF8C42', '#FF6B1A']}
              style={styles.gradientCard}
            >
              <Text style={styles.cardIcon}>🎯</Text>
              <Text style={styles.cardTextWhite}>Set{'\n'}Reminder</Text>
            </LinearGradient>
          </View>

          {/* Follow Calorie Budget Card */}
          <View style={[styles.card, styles.calorieCard]}>
            <LinearGradient
              colors={['#4A4A4A', '#2A2A2A']}
              style={styles.gradientCard}
            >
              <Text style={styles.cardIcon}>🔥</Text>
              <Text style={styles.cardTextWhite}>Follow daily{'\n'} articles</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF8C42', '#FF6B1A']}
            style={styles.buttonGradient}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleGoogleSignIn}
          disabled={!request || loading}
          activeOpacity={0.8}
        >
          <View style={styles.signInContent}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.googleIcon} />
                <Text style={styles.signInText}>Sign in with Google</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FF8C42',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoEmoji: {
    fontSize: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8C42',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  cardsContainer: {
    position: 'relative',
    width: 280,
    height: 300,
  },
  card: {
    position: 'absolute',
    width: 160,
    height: 140,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  trackCard: {
    backgroundColor: '#FFFFFF',
    top: 0,
    left: 0,
    transform: [{ rotate: '-8deg' }],
    zIndex: 3,
  },
  goalsCard: {
    top: 20,
    right: 0,
    transform: [{ rotate: '12deg' }],
    zIndex: 2,
  },
  calorieCard: {
    bottom: 0,
    left: 40,
    transform: [{ rotate: '-5deg' }],
    zIndex: 1,
  },
  gradientCard: {
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    height: '100%',
  },
  cardIcon: {
    fontSize: 32,
    alignSelf: 'flex-start',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 20,
  },
  cardTextWhite: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    gap: 15,
  },
  getStartedButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#333333',
    borderRadius: 25,
    paddingVertical: 18,
  },
  signInContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 10,
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Login;