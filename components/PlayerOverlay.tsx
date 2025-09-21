import React, { useMemo, useState, useRef } from 'react';
import { Dimensions, Image, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming, 
  runOnJS,
  interpolate,
  withSequence
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { usePlayer } from '@/context/PlayerContext';

const { height, width } = Dimensions.get('window');

export default function PlayerOverlay() {
  const { isVisible, track, isPlaying, toggle, close, positionMs, durationMs, skipBy, rate, setRate, seekTo } = usePlayer();
  const [isLiked, setIsLiked] = useState(false);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  const translateY = useSharedValue(height);
  const modalScale = useSharedValue(1);
  const sliderThumbScale = useSharedValue(1);
  const playButtonScale = useSharedValue(1);
  const sliderContainerRef = useRef(null);

  const progressPct = useMemo(() => {
    if (isDraggingSlider) return sliderValue;
    if (!durationMs) return 0;
    return Math.min(1, positionMs / durationMs);
  }, [positionMs, durationMs, isDraggingSlider, sliderValue]);

  const handleSeek = (position: number) => {
    if (durationMs && seekTo) {
      const seekTime = Math.floor(position * durationMs);
      console.log('Seeking to:', seekTime);
      seekTo(seekTime);
    }
  };



  const open = () => {
    translateY.value = withSpring(0, { 
      damping: 22, 
      stiffness: 180,
      mass: 0.7
    });
    modalScale.value = withSequence(
      withTiming(0.95, { duration: 0 }),
      withSpring(1, { damping: 20, stiffness: 250 })
    );
  };

  const dismiss = () => {
    translateY.value = withTiming(height, { duration: 350 }, (finished) => {
      if (finished) runOnJS(close)();
    });
  };

  React.useEffect(() => {
    if (isVisible) {
      // Set initial position off-screen
      translateY.value = height;
      modalScale.value = 1;
      // Start animation
      setTimeout(() => {
        open();
      }, 50);
    }
  }, [isVisible]);

  // Main modal pan responder - handles drag to dismiss from anywhere
  const modalPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return !isDraggingSlider && Math.abs(gestureState.dy) > 3;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return !isDraggingSlider && gestureState.dy > 8 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: () => {
        setIsDraggingModal(true);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isDraggingSlider) return;
        const newY = Math.max(0, gestureState.dy);
        translateY.value = newY;
        
        // Smooth scale effect while dragging
        const scale = 1 - (newY / height) * 0.05;
        modalScale.value = Math.max(0.95, scale);
      },
      onPanResponderRelease: (evt, gestureState) => {
        setIsDraggingModal(false);
        
        if (gestureState.dy > height * 0.25 || gestureState.vy > 1000) {
          dismiss();
        } else {
          translateY.value = withTiming(0, { duration: 300 });
          modalScale.value = withTiming(1, { duration: 300 });
        }
      },
    })
  ).current;

  // Enhanced slider pan responder - handles both dragging and clicking
  const sliderPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only become move responder if we're actually moving significantly
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: (evt) => {
        const { locationX } = evt.nativeEvent;
        const containerWidth = width - 56;
        const progress = Math.max(0, Math.min(1, locationX / containerWidth));
        
        setIsDraggingSlider(true);
        setSliderValue(progress);
        
        // Fast scale animation for immediate feedback
        sliderThumbScale.value = withTiming(1.4, { duration: 100 });
        
        // Immediately seek to position
        handleSeek(progress);
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX } = evt.nativeEvent;
        const containerWidth = width - 56;
        const progress = Math.max(0, Math.min(1, locationX / containerWidth));
        
        setSliderValue(progress);
        // Continuously seek during drag for smooth scrubbing
        handleSeek(progress);
      },
      onPanResponderRelease: (evt, gestureState) => {
        setIsDraggingSlider(false);
        
        // Quick scale back animation
        sliderThumbScale.value = withTiming(1, { duration: 150 });
        
        // Final seek to ensure we're at the exact position
        const { locationX } = evt.nativeEvent;
        const containerWidth = width - 56;
        const finalProgress = Math.max(0, Math.min(1, locationX / containerWidth));
        handleSeek(finalProgress);
      },
    })
  ).current;

  const handlePlayPress = () => {
    playButtonScale.value = withSequence(
      withSpring(0.9, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 20, stiffness: 300 })
    );
    toggle();
  };

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: modalScale.value }
    ],
  }));

  const sliderThumbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sliderThumbScale.value }],
  }));

  const playButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playButtonScale.value }],
  }));

  if (!isVisible || !track) return null;

  return (
    <View style={styles.overlay} {...modalPanResponder.panHandlers}>
      <BlurView intensity={100} tint="dark" style={styles.blurContainer}>
        <Animated.View style={[styles.card, containerStyle]}>
          <LinearGradient 
            colors={["rgba(28, 28, 30, 0.98)", "rgba(0, 0, 0, 0.95)"]} 
            style={styles.cardGradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.headerBtn} onPress={dismiss}>
                <Text style={styles.headerIcon}>↓</Text>
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>PLAYING FROM PLAYLIST</Text>
                <Text style={styles.headerSubtitle}>Starboy Remix</Text>
              </View>
              <TouchableOpacity style={styles.headerBtn}>
                <Text style={styles.headerIcon}>⋯</Text>
              </TouchableOpacity>
            </View>

            {/* Drag indicator */}
            <View style={styles.dragIndicator}>
              <View style={styles.dragBar} />
            </View>

            {/* Album Art */}
            <View style={styles.coverContainer}>
              <View style={styles.coverWrap}>
                {track.localImageRequire ? (
                  <Image source={track.localImageRequire} style={styles.cover} />
                ) : track.image ? (
                  <Image source={{ uri: track.image }} style={styles.cover} />
                ) : (
                  <View style={styles.placeholderCover}>
                    <Text style={styles.placeholderText}>♪</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Track Info */}
            <View style={styles.meta}>
              <Text style={styles.title} numberOfLines={2}>{track.title}</Text>
              {track.publisher && (
                <Text style={styles.artist}>{track.publisher}</Text>
              )}
            </View>

            {/* Progress Slider */}
            <View style={styles.progressSection}>
              <View 
                ref={sliderContainerRef}
                style={styles.sliderContainer} 
                {...sliderPanResponder.panHandlers}
              >
                <View style={styles.sliderTrack}>
                  <View 
                    style={[
                      styles.sliderFill, 
                      { width: `${progressPct * 100}%` }
                    ]} 
                  />
                  <Animated.View 
                    style={[
                      styles.sliderThumb, 
                      { 
                        left: `${progressPct * 100}%`,
                      },
                      sliderThumbStyle
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>
                  {formatTime(isDraggingSlider ? (sliderValue * durationMs) : positionMs)}
                </Text>
                <Text style={styles.timeText}>
                  {formatTime(durationMs)}
                </Text>
              </View>
            </View>

            {/* Controls */}
            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.controlBtn} onPress={() => skipBy(-15000)}>
                <Text style={styles.controlIcon}>⏪</Text>
              </TouchableOpacity>
              
              <Animated.View style={playButtonStyle}>
                <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
                  <Text style={styles.playIcon}>
                    {isPlaying ? '⏸' : '▶'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              
              <TouchableOpacity style={styles.controlBtn} onPress={() => skipBy(30000)}>
                <Text style={styles.controlIcon}>⏩</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <TouchableOpacity style={styles.bottomBtn}>
                <Text style={styles.bottomIcon}>⚡</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.bottomBtn} onPress={() => setRate(nextRate(rate))}>
                <Text style={styles.rateText}>{rate}x</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.bottomBtn} onPress={() => setIsLiked(!isLiked)}>
                <Text style={[styles.bottomIcon, { color: isLiked ? '#1DB954' : '#fff' }]}>
                  {isLiked ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.bottomBtn}>
                <Text style={styles.bottomIcon}>⋯</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </BlurView>
    </View>
  );
}

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString();
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function nextRate(r: number): number {
  const options = [0.75, 1.0, 1.25, 1.5, 2.0];
  const idx = options.findIndex((x) => x === r);
  return options[(idx + 1) % options.length];
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  blurContainer: {
    flex: 1,
  },
  card: {
    flex: 1,
    margin: 0,
    marginTop: 60,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  cardGradient: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dragIndicator: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  coverContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginVertical: 30,
  },
  coverWrap: {
    width: width - 80,
    height: width - 80,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: 'rgba(255,255,255,0.3)',
  },
  meta: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
  },
  artist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sliderContainer: {
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  sliderTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    marginLeft: -9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '500',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  controlBtn: {
    padding: 15,
    marginHorizontal: 25,
  },
  controlIcon: {
    color: '#fff',
    fontSize: 30,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playIcon: {
    color: '#000',
    fontSize: 28,
    fontWeight: '700',
    marginLeft: 2,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  bottomBtn: {
    padding: 12,
  },
  bottomIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  rateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});