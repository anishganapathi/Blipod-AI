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
  SlideInUp,
  SlideOutDown,
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

export default function GlassNavBar() {
  const [activeTab, setActiveTab] = useState(0);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [linkInput, setLinkInput] = useState('');

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
            onPress={() => setIsDialogVisible(true)}
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

      {/* Liquid Glass Dialog */}
      <Modal
        visible={isDialogVisible}
        transparent
        animationType="none"
        onRequestClose={() => setIsDialogVisible(false)}
      >
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsDialogVisible(false)}
          >
            <Animated.View
              entering={SlideInUp.springify().damping(20).stiffness(300)}
              exiting={SlideOutDown.duration(200)}
              style={styles.dialogContainer}
            >
              <BlurView
                intensity={100}
                tint="dark"
                style={styles.dialogBlur}
              >
                <View style={styles.dialogContent}>
                  <View style={styles.dialogHeader}>
                    <ThemedText style={styles.dialogTitle}>Add Link</ThemedText>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => {
                        setIsDialogVisible(false);
                        setLinkInput('');
                      }}
                    >
                      <Icon name="X" size={20} color="rgba(255, 255, 255, 0.8)" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.dialogBody}>
                    <ThemedText style={styles.dialogSubtitle}>
                      Enter a article or podcast link
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
                      entering={FadeIn.delay(200).duration(300)}
                      style={styles.buttonContainer}
                    >
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => {
                          setIsDialogVisible(false);
                          setLinkInput('');
                        }}
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
                            setIsDialogVisible(false);
                            setLinkInput('');
                          }
                        }}
                      >
                        <BlurView intensity={30} tint="dark" style={styles.buttonBlur}>
                          <ThemedText style={styles.addButtonText}>Add</ThemedText>
                        </BlurView>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dialogContainer: {
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  dialogBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dialogContent: {
    padding: 24,
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dialogTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBody: {
    alignItems: 'center',
  },
  dialogSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  addButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
  },
  buttonBlur: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: '600',
  },
});

