# Storyblok Expo SDK

A React Native/Expo SDK that provides seamless Storyblok CMS integration with automatic component rendering, visual editing support.

## Features

- **Automatic Component Rendering** - Components render based on Storyblok content structure
- **Visual Editor Integration** - Real-time preview updates in Storyblok's visual editor
- **Dynamic Story Loading** - Fetch different stories per page using custom hooks
- **Component Registration** - Centralized component mapping with type safety
- **TypeScript Support** - Full type definitions included
- **Development Tools** - Debug mode and error boundaries
- **Performance Optimized** - Efficient content fetching and rendering [TODO]

## Installation

```bash
npm install @storyblok/react-native-sdk
# or
yarn add @storyblok/react-native-sdk
```

## Quick Start

### 1. Initialize SDK and Components

```tsx
// app/_layout.tsx
import { Stack, useRouter } from 'expo-router';
import { StoryblokProvider, storyblokInit } from '../src/storyblok-expo-sdk';
import Page from '../components/storyblok/Page';
import Hero from '../components/storyblok/Hero';
import Feature from '../components/storyblok/Feature';

const storyblokApi = storyblokInit({
  config: {
    token: process.env.EXPO_PUBLIC_STORYBLOK_TOKEN,
    version: 'published',
    region: 'eu', // or 'us'
    debug: __DEV__
  },
  components: {
    page: Page,
    hero: Hero,
    feature: Feature,
  }
});

export default function RootLayout() {
  const router = useRouter();

  return (
    <StoryblokProvider 
      config={storyblokApi.config}
      router={router}
      components={storyblokApi.getComponents()}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="about" />
      </Stack>
    </StoryblokProvider>
  );
}
```

### 2. Create Page Components

```tsx
// app/index.tsx
import { ScrollView, View, Text } from 'react-native';
import { useStoryblokStory } from '../src/storyblok-expo-sdk';

export default function HomePage() {
  const { story, isLoading, error, renderContent } = useStoryblokStory('home');

  if (isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (error) {
    return <View><Text>Error: {error}</Text></View>;
  }

  return (
    <ScrollView>
      {renderContent()}
    </ScrollView>
  );
}
```

### 3. Create Storyblok Components

```tsx
// components/storyblok/Hero.tsx
import { View, Text, StyleSheet } from 'react-native';

interface HeroProps {
  blok: {
    title: string;
    subtitle: string;
    _uid: string;
    component: 'hero';
    [key: string]: any;
  };
}

export default function Hero({ blok }: HeroProps) {
  return (
    <View style={styles.hero}>
      <Text style={styles.title}>{blok.title}</Text>
      <Text style={styles.subtitle}>{blok.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});
```

## API Reference

### Core Functions

#### `storyblokInit(options)`

Initializes the Storyblok SDK with configuration and components.

```tsx
const storyblokApi = storyblokInit({
  config: {
    token: string;        // Storyblok access token
    version: 'draft' | 'published';
    region: 'eu' | 'us';  // API region
    debug: boolean;       // Enable debug logging
  },
  components: {
    [key: string]: React.ComponentType<any>;
  }
});
```

**Returns:**
- `config` - Configuration object
- `getComponents()` - Get registered components
- `registerComponent(name, component)` - Register single component
- `registerComponents(components)` - Register multiple components

#### `StoryblokProvider`

Context provider that wraps your application.

```tsx
<StoryblokProvider 
  config={StoryblokConfig}
  router={ExpoRouter}
  components={Record<string, ComponentType>}
>
  {children}
</StoryblokProvider>
```

### Hooks

#### `useStoryblokStory(slug)`

Fetches and manages a specific story by slug.

```tsx
const {
  story,              // Current story data
  draftContent,       // Draft version
  publishedContent,   // Published version
  isLoading,          // Loading state
  error,              // Error message
  isInEditor,         // Whether in Storyblok editor
  renderContent,      // Function to render content
  refreshContent      // Function to refresh story
} = useStoryblokStory('home');
```

#### `useStoryblok()`

Access the main Storyblok context and SDK instance.

```tsx
const {
  sdk,                // SDK instance
  isInEditor,         // Editor detection
  eventCount,         // Event counter for debugging
  renderContent       // Global render function
} = useStoryblok();
```

#### `useStoryblokContent()`

Access content from the provider's current story.

```tsx
const {
  content,            // Current content
  draftContent,       // Draft content
  publishedContent,   // Published content
  isInEditor,         // Editor state
  renderContent       // Render function
} = useStoryblokContent();
```

#### `useStoryblokComponent(slug, componentType)`

Get a specific component from a story.

```tsx
const heroComponent = useStoryblokComponent('home', 'hero');
```

#### `useStoryblokComponents(slug, componentType)`

Get all components of a specific type from a story.

```tsx
const features = useStoryblokComponents('home', 'feature');
```

## Advanced Usage

### Custom Component Rendering

```tsx
export default function CustomPage() {
  const { story, renderContent } = useStoryblokStory('custom');
  
  return (
    <ScrollView>
      {story?.content.body?.map((blok) => {
        // Custom wrapper for specific components
        if (blok.component === 'hero') {
          return (
            <View key={blok._uid} style={{ backgroundColor: '#f0f0f0' }}>
              {renderContent(blok)}
            </View>
          );
        }
        return renderContent(blok);
      })}
    </ScrollView>
  );
}
```

### Container Components

```tsx
export default function Grid({ blok }) {
  const { sdk } = useStoryblok();

  return (
    <View style={styles.grid}>
      {blok.columns?.map((column) => (
        <View key={column._uid} style={styles.column}>
          {sdk?.renderStoryblokContent(column)}
        </View>
      ))}
    </View>
  );
}
```

### Multiple Story Access

```tsx
export default function DashboardPage() {
  const homeStory = useStoryblokStory('home');
  const profileStory = useStoryblokStory('profile');
  
  return (
    <ScrollView>
      <Text>Home Content:</Text>
      {homeStory.renderContent()}
      
      <Text>Profile Content:</Text>
      {profileStory.renderContent()}
    </ScrollView>
  );
}
```

### Dynamic Component Registration

```tsx
// Register components at runtime
const { registerComponent } = storyblokApi;

const DynamicComponent = ({ blok }) => (
  <View><Text>{blok.message}</Text></View>
);

registerComponent('dynamic-component', DynamicComponent);
```

## Visual Editor Integration

The SDK automatically handles visual editor integration when your app runs inside Storyblok's iframe:

- Real-time content updates

### Editor Event Handling

```tsx
const { sdk } = useStoryblok();

useEffect(() => {
  const handleContentChange = (data) => {
    console.log('Content updated:', data);
  };

  const handlePublish = () => {
    console.log('Content published');
  };

  sdk?.on('input', handleContentChange);
  sdk?.on('published', handlePublish);

  return () => {
    sdk?.off('input', handleContentChange);
    sdk?.off('published', handlePublish);
  };
}, [sdk]);
```

## TypeScript Support

### Component Props Interface

```tsx
interface StoryblokComponentProps {
  blok: {
    _uid: string;
    component: string;
    [key: string]: any;
  };
  _editable?: string;
}

interface HeroProps extends StoryblokComponentProps {
  blok: {
    title: string;
    subtitle: string;
    image?: {
      filename: string;
      alt: string;
    };
  } & StoryblokComponentProps['blok'];
}
```

### Configuration Types

```tsx
interface StoryblokConfig {
  token: string;
  version: 'draft' | 'published';
  region?: 'eu' | 'us';
  debug?: boolean;
}
```

## Error Handling

### Component-Level Error Boundaries

```tsx
import { StoryblokErrorBoundary } from '../src/storyblok-expo-sdk';

export default function SafePage() {
  const { renderContent } = useStoryblokStory('home');
  
  return (
    <StoryblokErrorBoundary>
      {renderContent()}
    </StoryblokErrorBoundary>
  );
}
```

### Missing Component Handling

Missing components are automatically handled with visual indicators in debug mode:

```tsx
// Renders a red dashed border with error message
<View style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: '#ff6b6b' }}>
  <Text style={{ color: '#ff6b6b' }}>
    Component "missing-component" not found
  </Text>
</View>
```

## Performance Optimization

### Component Memoization

```tsx
import React, { memo } from 'react';

export default memo(function Feature({ blok }) {
  return (
    <View>
      <Text>{blok.title}</Text>
    </View>
  );
});
```

### Lazy Loading

```tsx
const LazyComponent = lazy(() => import('./HeavyComponent'));

export default function OptimizedPage() {
  return (
    <Suspense fallback={<Text>Loading component...</Text>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## Debug Mode

Enable debug mode during development:

```tsx
{
  token: 'your-token',
  debug: __DEV__, // Enable in development
}
```

Debug mode provides:
- Console logs for SDK events
- Component registration status
- Content loading states
- Visual editor event tracking
- Missing component warnings

### Debug Commands

```tsx
// Check registered components
console.log(storyblokApi.getComponents());

// Check story data
const { story } = useStoryblokStory('home');
console.log('Story data:', story);

// Check editor state
const { isInEditor } = useStoryblok();
console.log('In editor:', isInEditor);
```

## Best Practices

### Component Naming
- Use consistent naming between Storyblok and React components
- Storyblok: `hero_section` → React: `HeroSection`
- Register with lowercase: `hero_section: HeroSection`

### Content Structure
```tsx
// Always check for data existence
export default function SafeComponent({ blok }) {
  if (!blok?.items?.length) {
    return null;
  }

  return (
    <View>
      {blok.items.map((item) => (
        <Text key={item._uid}>{item.title}</Text>
      ))}
    </View>
  );
}
```

### Performance
- Use `_uid` as the key for mapped components
- Implement proper loading states
- Handle errors gracefully
- Use React.memo for static components

### Security
- Store tokens in environment variables
- Use 'published' version in production
- Validate content before rendering
- Sanitize user-generated content

## Environment Configuration

```bash
# .env.local
EXPO_PUBLIC_STORYBLOK_TOKEN=your_preview_token_here
```

```tsx
// Production configuration
const config = {
  token: process.env.EXPO_PUBLIC_STORYBLOK_TOKEN,
  version: __DEV__ ? 'draft' : 'published',
  region: 'eu',
  debug: __DEV__
};
```

## Troubleshooting

### Common Issues

**Component not rendering**
- Verify component registration in `storyblokInit`
- Check component name matches Storyblok schema
- Ensure component is exported as default

**Content not loading**
- Verify token has correct permissions
- Check story slug exists in Storyblok
- Confirm API region setting

**Visual editor not working**
- Ensure app runs in Storyblok iframe
- Check for console errors
- Verify bridge script loads correctly

**TypeScript errors**
- Import proper types from SDK
- Extend `StoryblokComponentProps` interface
- Use proper blok prop typing

### Debug Checklist

1. Check network requests in dev tools
2. Verify token permissions in Storyblok
3. Confirm story exists and is published
4. Check component registration
5. Review console for error messages
6. Test outside of visual editor

## Migration Guide

### From Basic Storyblok

1. Replace manual API calls with hooks
2. Update component props to use `blok` structure
3. Register components in `storyblokInit`
4. Use `renderContent()` instead of manual mapping

### From Next.js Storyblok

1. Replace `getStaticProps` with `useStoryblokStory`
2. Update imports to Expo SDK
3. Replace HTML elements with React Native components
4. Update styling to StyleSheet API

## Support

For issues and feature requests, please use the GitHub repository or contact the development team.