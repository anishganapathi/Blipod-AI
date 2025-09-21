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
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 80,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FF8C42',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#FF8C42',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF8C42',
    letterSpacing: 0.5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: -40,
  },
  cardsContainer: {
    position: 'relative',
    width: 300,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: 170,
    height: 140,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  trackCard: {
    backgroundColor: '#FFFFFF',
    top: -10,
    left: -40,
    transform: [{ rotate: '-12deg' }],
    zIndex: 3,
  },
  goalsCard: {
    top: 0,
    right: -30,
    transform: [{ rotate: '8deg' }],
    zIndex: 2,
  },
  calorieCard: {
    bottom: 20,
    left: 10,
    transform: [{ rotate: '-5deg' }],
    zIndex: 1,
  },
  gradientCard: {
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
    height: '100%',
  },
  cardIcon: {
    fontSize: 36,
    alignSelf: 'flex-start',
  },
  cardText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 22,
  },
  cardTextWhite: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  bottomContainer: {
    paddingHorizontal: 28,
    paddingBottom: 60,
    gap: 18,
    marginTop: 20,
  },
  getStartedButton: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#FF8C42',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  signInButton: {
    backgroundColor: '#333333',
    borderRadius: 28,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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