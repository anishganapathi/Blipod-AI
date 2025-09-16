import React from 'react';
import { StoryblokProvider } from './src/storyblok-live-sdk';
import { TestHomePage } from './src/components/TestHomePage';

// Replace with your actual values
const config = {
  token: 'wANpEQEsMYGOwLxwXQ3dDAtt', // Your Storyblok token
  wsServerUrl: 'wss://589bf9783eb0.ngrok-free.app/ws', // Your WebSocket URL
  version: 'draft',
  region: 'eu',
  debug: true // Keep this true for testing
};

export default function App() {
  return (
    <StoryblokProvider config={config}>
      <TestHomePage />
    </StoryblokProvider>
  );
}