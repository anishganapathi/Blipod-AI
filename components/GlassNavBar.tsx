import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Platform } from "react-native";
import { BlurView } from "expo-blur";
import Icon from "./LucideIcons";
import { ThemedText } from "./themed-text";
import Animated, {
  FadeInRight,
  FadeOutLeft,
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

export default function GlassNavBar() {
  const [activeTab, setActiveTab] = useState(0);

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

      {/* Floating Action Button (glass) */}
      <View style={styles.fabWrapper} pointerEvents="box-none">
        <BlurView intensity={50} tint="dark" style={styles.fabGlass}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Add"
            activeOpacity={0.8}
            style={styles.fabButton}
            onPress={() => { /* TODO: hook action */ }}
          >
            <Icon name="Plus" size={22} color="#fff" />
          </TouchableOpacity>
        </BlurView>
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
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
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
});
