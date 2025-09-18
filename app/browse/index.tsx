import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../components/themed-text";
import { BlurView } from "expo-blur";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 20px padding on sides + 20px gap

const CATEGORIES = [
  { 
    id: "1", 
    title: "Podcasts", 
    image: "https://picsum.photos/400/400?1",
    subtitle: "Latest episodes",
    color: "#FF6B6B"
  },
  { 
    id: "2", 
    title: "Music", 
    image: "https://picsum.photos/400/400?2",
    subtitle: "Trending tracks",
    color: "#4ECDC4"
  },
  { 
    id: "3", 
    title: "News", 
    image: "https://picsum.photos/400/400?3",
    subtitle: "Stay informed",
    color: "#45B7D1"
  },
  { 
    id: "4", 
    title: "Sports", 
    image: "https://picsum.photos/400/400?4",
    subtitle: "Game highlights",
    color: "#96CEB4"
  },
  { 
    id: "5", 
    title: "Technology", 
    image: "https://picsum.photos/400/400?5",
    subtitle: "Tech updates",
    color: "#FECA57"
  },
  { 
    id: "6", 
    title: "Lifestyle", 
    image: "https://picsum.photos/400/400?6",
    subtitle: "Living better",
    color: "#FF9FF3"
  },
  { 
    id: "7", 
    title: "Business", 
    image: "https://picsum.photos/400/400?7",
    subtitle: "Market insights",
    color: "#54A0FF"
  },
  { 
    id: "8", 
    title: "Health", 
    image: "https://picsum.photos/400/400?8",
    subtitle: "Wellness tips",
    color: "#5F27CD"
  },
];

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface CategoryCardProps {
  item: typeof CATEGORIES[0];
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ item, index }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 400 });
  };

  return (
    <AnimatedTouchableOpacity
      style={[styles.card, animatedStyle]}
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      
      {/* Glass overlay with gradient */}
      <View style={[styles.overlay, { backgroundColor: `${item.color}20` }]} />
      
      <BlurView intensity={60} tint="dark" style={styles.glassOverlay}>
        <View style={styles.cardContent}>
          <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.cardSubtitle}>{item.subtitle}</ThemedText>
        </View>
        
        {/* Accent line */}
        <View style={[styles.accentLine, { backgroundColor: item.color }]} />
      </BlurView>
    </AnimatedTouchableOpacity>
  );
};

export default function BrowsePage(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Animated header */}
        <Animated.View 
          entering={FadeInDown.duration(600).springify().damping(20)}
          style={styles.headerContainer}
        >
          <ThemedText style={styles.header}>Browse</ThemedText>
          <ThemedText style={styles.subtitle}>
            Discover content across categories
          </ThemedText>
        </Animated.View>

        {/* Search bar */}
        <Animated.View 
          entering={FadeInRight.delay(200).duration(500).springify()}
          style={styles.searchContainer}
        >
          <TouchableOpacity 
            style={styles.searchTouchable}
            activeOpacity={0.7}
            onPress={() => {
              // Handle search press
              console.log('Search pressed');
            }}
          >
            <BlurView intensity={30} tint="dark" style={styles.searchBlur}>
              <View style={styles.searchContent}>
                <ThemedText style={styles.searchIcon}>🔍</ThemedText>
                <ThemedText style={styles.searchPlaceholder}>
                  Search categories...
                </ThemedText>
              </View>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Categories grid */}
        <FlatList
          data={CATEGORIES}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInUp.delay(index * 100).springify().damping(20).stiffness(300)}
            >
              <CategoryCard item={item} index={0} />
            </Animated.View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.row}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchTouchable: {
    borderRadius: 16,
  },
  searchBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  gridContainer: {
    paddingTop: 8,
    paddingBottom: 120, // Extra space for nav bar
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: cardWidth,
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  glassOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    fontWeight: "500",
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});