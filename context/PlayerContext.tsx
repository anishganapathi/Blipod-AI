import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import type { AVPlaybackStatus } from 'expo-av';

export type PlayerTrack = {
  id?: string;
  title: string;
  subtitle?: string;
  image?: string; // remote URL
  localImageRequire?: any; // for require('...') if needed
  publisher?: string;
  url: string; // remote mp3/stream
};

type PlayerContextValue = {
  isVisible: boolean;
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  rate: number;
  track?: PlayerTrack;
  open: (track: PlayerTrack) => Promise<void>;
  close: () => void;
  toggle: () => Promise<void>;
  seekTo: (ms: number) => Promise<void>;
  skipBy: (deltaMs: number) => Promise<void>;
  setRate: (rate: number) => Promise<void>;
};

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export const usePlayer = (): PlayerContextValue => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [rate, setPlaybackRate] = useState(1.0);
  const [track, setTrack] = useState<PlayerTrack | undefined>(undefined);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  const unload = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current.setOnPlaybackStatusUpdate(null);
      soundRef.current = null;
    }
  }, []);

  const open = useCallback(async (next: PlayerTrack) => {
    await unload();
    const { sound } = await Audio.Sound.createAsync(
      { uri: next.url },
      { shouldPlay: true, rate },
      (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        setIsPlaying(status.isPlaying ?? false);
        setPositionMs(status.positionMillis ?? 0);
        setDurationMs(status.durationMillis ?? 0);
      }
    );
    soundRef.current = sound;
    setTrack(next);
    setIsVisible(true);
  }, [rate, unload]);

  const close = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggle = useCallback(async () => {
    try {
      const sound = soundRef.current;
      if (!sound) return;
      const status = await sound.getStatusAsync();
      if (!('isLoaded' in status) || !status.isLoaded) return;

      if (status.isPlaying) {
        setIsPlaying(false); // optimistic update
        await sound.pauseAsync();
      } else {
        setIsPlaying(true); // optimistic update
        await sound.playAsync();
      }
    } catch (e) {
      // no-op; keep UI stable
    }
  }, []);

  const seekTo = useCallback(async (ms: number) => {
    const sound = soundRef.current;
    if (!sound) return;
    await sound.setPositionAsync(Math.max(0, ms));
  }, []);

  const skipBy = useCallback(async (deltaMs: number) => {
    const target = positionMs + deltaMs;
    await seekTo(target);
  }, [positionMs, seekTo]);

  const setRate = useCallback(async (r: number) => {
    const sound = soundRef.current;
    setPlaybackRate(r);
    if (sound) {
      await sound.setRateAsync(r, true);
    }
  }, []);

  const value = useMemo(
    () => ({ isVisible, isPlaying, positionMs, durationMs, rate, track, open, close, toggle, seekTo, skipBy, setRate }),
    [isVisible, isPlaying, positionMs, durationMs, rate, track, open, close, toggle, seekTo, skipBy, setRate]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};


