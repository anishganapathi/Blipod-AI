import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Platform, Modal, Dimensions, TextInput } from "react-native";
import { BlurView } from "expo-blur";
import Icon from "./LucideIcons";
import { ThemedText } from "./themed-text";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  withSequence,
  Easing,
} from "react-native-reanimated";
import ProfilePage from "@/app/account";
import HomePage from "@/app/home";
import AudioPage from "@/app/audio";
import BrowsePage from "@/app/browse";

interface NavItem {
  icon: string;
  label: string;
  screen: React.ComponentType; // component reference, not invoked here
}

const NAV_ITEMS: NavItem[] = [
  { icon: "Inbox", label: "Inbox", screen: HomePage },
  { icon: "Headphones", label: "Audio", screen: AudioPage },
  { icon: "ChartBarBig", label: "Browse", screen: BrowsePage },
  { icon: "User", label: "You", screen: ProfilePage },
];

const { width, height } = Dimensions.get('window');

export default function GlassNavBar(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState(0);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [linkInput, setLinkInput] = useState('');

  // FAB animation values
  const fabScale = useSharedValue(1);
  const fabOpacity = useSharedValue(1);
  const fabRotation = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const handleFABPress = (): void => {
    // iOS-style haptic feedback simulation through animation
    fabScale.value = withSequence(
      withSpring(0.85, { 
        damping: 20,
        stiffness: 400,
        mass: 0.5 
      }),
      withSpring(1.05, { 
        damping: 15,
        stiffness: 300,
        mass: 0.7 
      }),
      withSpring(1, { 
        damping: 20,
        stiffness: 400 
      })
    );

    // Subtle rotation for premium feel
    fabRotation.value = withSequence(
      withTiming(15, { duration: 150 }),
      withTiming(0, { duration: 200 })
    );

    // Reveal overlay with smooth timing
    overlayOpacity.value = withTiming(1, { duration: 300 });
    
    // Show modal after animation starts
    setTimeout(() => {
      setIsDialogVisible(true);
    }, 100);
  };

  const handleDialogClose = (): void => {
    // Smooth hide animation
    overlayOpacity.value = withTiming(0, { duration: 200 });
    setIsDialogVisible(false);
    setLinkInput('');
  };

  // Animated styles for FAB
  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: fabScale.value },
        { rotate: `${fabRotation.value}deg` }
      ],
      opacity: fabOpacity.value,
    };
  });

  // Animated overlay style for reveal effect
  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(overlayOpacity.value, [0, 1], [0.3, 1]);
    return {
      opacity: overlayOpacity.value,
      transform: [{ scale }],
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Active screen with shared axis transition */}
      <View style={styles.screenContainer}>
        <Animated.View
          key={activeTab} // triggers animation on tab change
          entering={FadeInRight.duration(250)}
          exiting={FadeOutLeft.duration(250)}
          style={{ flex: 1 }}
        >
          {(() => {
            const ActiveScreen = NAV_ITEMS[activeTab].screen;
            return <ActiveScreen />;
          })()}
        </Animated.View>
      </View>

      {/* Floating Action Button (glass) with enhanced animation */}
      <View style={styles.fabWrapper} pointerEvents="box-none">
        <Animated.View style={fabAnimatedStyle}>
          <BlurView intensity={50} tint="dark" style={styles.fabGlass}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Add"
              activeOpacity={0.9}
              style={styles.fabButton}
              onPress={handleFABPress}
            >
              <Icon name="Plus" size={22} color="#fff" />
            </TouchableOpacity>
          </BlurView>
        </Animated.View>

        {/* Ripple effect overlay */}
        <Animated.View 
          style={[styles.fabRipple, overlayAnimatedStyle]}
          pointerEvents="none"
        >
          <BlurView intensity={30} tint="light" style={styles.rippleBlur} />
        </Animated.View>
      </View>

      {/* Glass bottom nav */}
      <View style={styles.container}>
        <BlurView style={styles.blurContainer} intensity={50} tint="dark">
          <View style={styles.content}>
            {NAV_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.navItem,
                  index === activeTab && styles.activeNavItem,
                ]}
                onPress={() => setActiveTab(index)}
                activeOpacity={0.7}
              >
                <Icon
                  name={item.icon}
                  size={24}
                  color={
                    index === activeTab ? "#fff" : "rgba(255, 255, 255, 0.6)"
                  }
                />
                <ThemedText
                  style={[
                    styles.navText,
                    index === activeTab && styles.activeNavText,
                  ]}
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      </View>

      {/* Enhanced Liquid Glass Dialog - Now Centered */}
      <Modal
        visible={isDialogVisible}
        transparent
        animationType="none"
        onRequestClose={handleDialogClose}
      >
        <Animated.View
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(250)}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleDialogClose}
          >
              <Animated.View
                entering={ZoomIn.springify().damping(25).stiffness(350).mass(0.8)}
                exiting={ZoomOut.springify().damping(30).stiffness(400)}
                style={styles.dialogContainer}
              >
              <BlurView
                intensity={120}
                tint="dark"
                style={styles.dialogBlur}
              >
                <View style={styles.dialogContent}>
                    <Animated.View 
                      entering={FadeIn.delay(200).duration(400)}
                      style={styles.dialogHeader}
                    >
                    <ThemedText style={styles.dialogTitle}>Add Link</ThemedText>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={handleDialogClose}
                      activeOpacity={0.7}
                    >
                      <Icon name="X" size={20} color="rgba(255, 255, 255, 0.8)" />
                    </TouchableOpacity>
                  </Animated.View>
                  
                  <Animated.View 
                    entering={FadeIn.delay(300).duration(500)}
                    style={styles.dialogBody}
                  >
                    <ThemedText style={styles.dialogSubtitle}>
                      Enter an article or podcast link
                    </ThemedText>
                    
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="https://example.com/podcast.mp3"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        value={linkInput}
                        onChangeText={setLinkInput}
                        autoFocus
                        keyboardType="url"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                    
                    <Animated.View 
                      entering={FadeIn.delay(500).duration(400)}
                      style={styles.buttonContainer}
                    >
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={handleDialogClose}
                        activeOpacity={0.8}
                      >
                        <BlurView intensity={20} tint="dark" style={styles.buttonBlur}>
                          <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                        </BlurView>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.addButton]}
                        onPress={() => {
                          if (linkInput.trim()) {
                            // TODO: Handle adding the link
                            console.log('Adding link:', linkInput);
                            handleDialogClose();
                          }
                        }}
                        activeOpacity={0.8}
                      >
                        <BlurView intensity={30} tint="dark" style={styles.buttonBlur}>
                          <ThemedText style={styles.addButtonText}>Add</ThemedText>
                        </BlurView>
                      </TouchableOpacity>
                    </Animated.View>
                  </Animated.View>
                </View>
              </BlurView>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fabWrapper: {
    position: 'absolute',
    right: 28,
    bottom: Platform.OS === 'ios' ? 110 : 95, // slightly above nav bar
  },
  fabGlass: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 28, 30, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabRipple: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
  },
  rippleBlur: {
    flex: 1,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
  },
  container: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 20,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  blurContainer: {
    flex: 1,
    backgroundColor: "rgba(28, 28, 30, 0.85)",
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    minWidth: 70,
    opacity: 0.7,
  },
  activeNavItem: {
    transform: [{ scale: 1.05 }],
    opacity: 1,
  },
  navText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 6,
    fontWeight: "500",
  },
  activeNavText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  dialogContainer: {
    width: width * 0.9,
    maxWidth: 400,
  },
  dialogBlur: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 28, 30, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  dialogContent: {
    padding: 28,
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dialogTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dialogBody: {
    alignItems: 'center',
  },
  dialogSubtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 28,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    minHeight: 52,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 14,
  },
  actionButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    minHeight: 52,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  addButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.4)',
    backgroundColor: 'rgba(255, 165, 0, 0.05)',
  },
  buttonBlur: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: '600',
  },
});