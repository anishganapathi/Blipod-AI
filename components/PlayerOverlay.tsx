import React, { useMemo } from 'react';
import { Dimensions, Image, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { usePlayer } from '@/context/PlayerContext';

const { height, width } = Dimensions.get('window');

export default function PlayerOverlay() {
  const { isVisible, track, isPlaying, toggle, close, positionMs, durationMs, skipBy, rate, setRate } = usePlayer();

  const translateY = useSharedValue(height);

  const open = () => {
    translateY.value = withSpring(0, { damping: 18, stiffness: 140 });
  };

  const dismiss = () => {
    translateY.value = withTiming(height, { duration: 200 }, (finished) => {
      if (finished) runOnJS(close)();
    });
  };

  React.useEffect(() => {
    if (isVisible) open();
  }, [isVisible]);

  const pan = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        translateY.value = Math.max(0, g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > height * 0.2) {
          dismiss();
        } else {
          translateY.value = withSpring(0);
        }
      },
    })
  ).current;

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const progressPct = useMemo(() => {
    if (!durationMs) return 0;
    return Math.min(1, positionMs / durationMs);
  }, [positionMs, durationMs]);

  if (!isVisible || !track) return null;

  return (
    <Animated.View style={[styles.overlay, containerStyle]} pointerEvents="box-none">
      <LinearGradient colors={["#2b1a12", "#0b0b0b"]} style={styles.card}>
        <View {...pan.panHandlers}>
          <View style={styles.grabber} />
        </View>

        <View style={styles.coverWrap}>
          {track.localImageRequire ? (
            <Image source={track.localImageRequire} style={styles.cover} />
          ) : track.image ? (
            <Image source={{ uri: track.image }} style={styles.cover} />
          ) : null}
        </View>

        <View style={styles.meta}>
          {!!track.publisher && <Text style={styles.publisher}>{track.publisher.toUpperCase()}</Text>}
          <Text style={styles.title}>{track.title}</Text>
        </View>

        {/* Progress mock waveform bar */}
        <View style={styles.waveRow}>
          <View style={styles.waveBarBg}>
            <View style={[styles.waveBarFill, { width: `${progressPct * 100}%` }]} />
          </View>
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeTxt}>{formatTime(positionMs)}</Text>
          <Text style={styles.timeTxt}>{formatTime(durationMs)}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => skipBy(-15000)}>
            <Text style={styles.ctrlIcon}>↺15s</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playBtn} onPress={toggle}>
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => skipBy(30000)}>
            <Text style={styles.ctrlIcon}>30s↻</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.bottomBtn}>
            <Text style={styles.bottomTxt}>≡</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBtn} onPress={() => setRate(nextRate(rate))}>
            <Text style={styles.bottomTxt}>{rate.toFixed(1)}x</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBtn}>
            <Text style={styles.bottomTxt}>♡</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
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
    justifyContent: 'flex-end',
  },
  card: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
  },
  coverWrap: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: width - 80,
    borderRadius: 16,
  },
  meta: {
    marginTop: 16,
  },
  publisher: {
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.4,
    fontSize: 12,
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  waveRow: {
    marginTop: 20,
  },
  waveBarBg: {
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  waveBarFill: {
    height: '100%',
    backgroundColor: '#FFA500',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeTxt: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  ctrlBtn: {
    padding: 12,
  },
  ctrlIcon: {
    color: '#fff',
    fontSize: 14,
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#000',
    fontSize: 28,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  bottomBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  bottomTxt: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
  },
});


