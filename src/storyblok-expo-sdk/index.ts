import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
import type { StoryblokConfig, StoryblokStory, StoryblokEvent, StoryblokContextType, StoryblokEventType } from './types';
import React from 'react';

declare global {
  interface Window {
    StoryblokBridge: any;
    sbBridge: any;
  }
}

const StoryblokContext = createContext<StoryblokContextType | null>(null);

interface StoryblokProviderProps {
  children: ReactNode;
  config: StoryblokConfig;
  storySlug?: string;
  router?: any;
  components?: Record<string, React.ComponentType<any>>;
}

interface StoryblokOptions {
  config: StoryblokConfig;
  components?: Record<string, React.ComponentType<any>>;
}

// Global component registry
let globalComponents: Record<string, React.ComponentType<any>> = {};

export class StoryblokSDK {
  private config: StoryblokConfig;
  private bridge: any = null;
  private callbacks: Map<string, Function[]> = new Map();
  private router: any = null;
  private isInEditor: boolean = false;
  private originalUrl: string = '';
  private cleanPathname: string = '';
  private urlCleanupInterval: ReturnType<typeof setInterval> | null = null;
  private components: Record<string, React.ComponentType<any>> = {};

  constructor(config: StoryblokConfig, router?: any, components?: Record<string, React.ComponentType<any>>) {
    this.config = config;
    this.router = router;
    this.components = components || {};
    this.isInEditor = typeof window !== 'undefined' && window.self !== window.top;
    
    if (this.isInEditor) {
      this.initializeExpoRouterIntegration();
    }
  }

  // Component registration methods
  registerComponent(name: string, component: React.ComponentType<any>): void {
    this.components[name] = component;
    globalComponents[name] = component;
  }

  registerComponents(components: Record<string, React.ComponentType<any>>): void {
    Object.entries(components).forEach(([name, component]) => {
      this.registerComponent(name, component);
    });
  }

  getComponent(name: string): React.ComponentType<any> | null {
    return this.components[name] || globalComponents[name] || null;
  }

  // Render Storyblok content with registered components
  renderStoryblokContent(content: any, key?: string): React.ReactNode {
    if (!content) return null;

    // If content is an array, render each item
    if (Array.isArray(content)) {
      return content.map((item, index) => 
        this.renderStoryblokContent(item, `${key || 'item'}-${index}`)
      );
    }

    // If content has a component field, try to render it
    if (content.component) {
      const Component = this.getComponent(content.component);
      
      if (Component) {
        const props = {
          ...content,
          key: key || content._uid || `component-${Math.random()}`,
          blok: content, // Pass the whole blok as a prop (Next.js style)
          _editable: content._editable, // Pass editable info for visual editing
        };

        return React.createElement(Component, props);
      } else {
        // Component not found, render a placeholder or warning
        if (this.config.debug) {
          console.warn(`[Storyblok SDK] Component "${content.component}" not registered`);
        }
        
        return React.createElement(
          'div',
          { 
            key: key || content._uid,
            style: { 
              border: '2px dashed #ff6b6b', 
              padding: 16, 
              margin: 8,
              backgroundColor: '#fff5f5',
              borderRadius: 4
            }
          },
          React.createElement('text', { style: { color: '#ff6b6b' } }, 
            `Component "${content.component}" not found`
          )
        );
      }
    }

    // If content is an object with nested content, recursively render
    if (typeof content === 'object') {
      const renderedContent: any = {};
      
      Object.entries(content).forEach(([key, value]) => {
        if (Array.isArray(value) && value.some(item => item?.component)) {
          renderedContent[key] = this.renderStoryblokContent(value, key);
        } else if (value && typeof value === 'object' && value.component) {
          renderedContent[key] = this.renderStoryblokContent(value, key);
        } else {
          renderedContent[key] = value;
        }
      });

      return renderedContent;
    }

    return content;
  }

  private initializeExpoRouterIntegration(): void {
    if (typeof window === 'undefined') return;

    this.originalUrl = window.location.origin + window.location.pathname;
    this.cleanPathname = window.location.pathname;

    this.cleanStoryblokParams();
    this.urlCleanupInterval = setInterval(() => {
      this.cleanStoryblokParams();
    }, 100);

    this.setupHistoryInterception();
  }

  private cleanStoryblokParams(): void {
    if (typeof window === 'undefined') return;

    const currentUrl = new URL(window.location.href);
    let hasStoryblokParams = false;

    for (const key of currentUrl.searchParams.keys()) {
      if (key.startsWith('_storyblok')) {
        currentUrl.searchParams.delete(key);
        hasStoryblokParams = true;
      }
    }

    if (hasStoryblokParams) {
      const cleanUrl = currentUrl.pathname + (currentUrl.search || '');
      
      window.history.replaceState(
        window.history.state, 
        document.title, 
        cleanUrl
      );

      if (this.config.debug) {
        console.log('[Storyblok SDK] Cleaned URL from Storyblok parameters:', cleanUrl);
      }
    }
  }

  private setupHistoryInterception(): void {
    if (typeof window === 'undefined') return;

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = (state: any, title: string, url?: string | URL) => {
      if (url && typeof url === 'string' && this.shouldInterceptUrl(url)) {
        const cleanUrl = this.removeStoryblokParamsFromUrl(url);
        return originalPushState.call(window.history, state, title, cleanUrl);
      }
      return originalPushState.call(window.history, state, title, url);
    };

    window.history.replaceState = (state: any, title: string, url?: string | URL) => {
      if (url && typeof url === 'string' && this.shouldInterceptUrl(url)) {
        const cleanUrl = this.removeStoryblokParamsFromUrl(url);
        return originalReplaceState.call(window.history, state, title, cleanUrl);
      }
      return originalReplaceState.call(window.history, state, title, url);
    };

    window.addEventListener('popstate', () => {
      setTimeout(() => this.cleanStoryblokParams(), 10);
    });
  }

  private shouldInterceptUrl(url: string): boolean {
    return url.includes('_storyblok');
  }

  private removeStoryblokParamsFromUrl(url: string): string {
    try {
      const urlObj = new URL(url, window.location.origin);
      
      for (const key of Array.from(urlObj.searchParams.keys())) {
        if (key.startsWith('_storyblok')) {
          urlObj.searchParams.delete(key);
        }
      }
      
      return urlObj.pathname + (urlObj.search || '');
    } catch (error) {
      if (this.config.debug) {
        console.warn('[Storyblok SDK] Failed to parse URL:', url, error);
      }
      return url;
    }
  }

  async loadBridge(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window object not available'));
        return;
      }

      if (window.StoryblokBridge) {
        this.initializeBridge();
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://app.storyblok.com/f/storyblok-v2-latest.js';
      script.async = true;

      script.onload = () => {
        this.initializeBridge();
        resolve(true);
      };

      script.onerror = () => {
        reject(new Error('Failed to load Storyblok Bridge script'));
      };

      document.head.appendChild(script);
    });
  }

  private initializeBridge(): void {
    if (!window.StoryblokBridge) {
      throw new Error('StoryblokBridge not available');
    }

    this.bridge = new window.StoryblokBridge();
    window.sbBridge = this.bridge;

    const events: StoryblokEventType[] = [
      'input', 'change', 'published', 'unpublished', 'viewLiveVersion',
      'enterEditmode', 'enterComponent', 'hoverComponent', 'highlightComponent',
      'customEvent', 'pingBack', 'sessionReceived', 'editedBlok', 'deselectBlok',
      'addedBlock', 'deletedBlock', 'movedBlock', 'duplicatedBlock'
    ];

    events.forEach(event => {
      this.bridge.on(event, (data: any) => {
        if (this.isInEditor) {
          setTimeout(() => this.cleanStoryblokParams(), 10);
        }
        
        this.emit(event, data);
        if (this.config.debug) {
          console.log(`[Storyblok SDK] Event: ${event}`, data);
        }
      });
    });

    this.bridge.on('viewLiveVersion', () => {
      if (this.router && this.cleanPathname) {
        this.router.replace(this.cleanPathname);
      }
    });
  }

  on(event: string, callback: Function): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  async fetchStory(slug: string, version: 'draft' | 'published' = 'draft'): Promise<StoryblokStory> {
    const response = await fetch(
      `https://api${this.config.region === 'us' ? '-us' : ''}.storyblok.com/v2/cdn/stories/${slug}?token=${this.config.token}&version=${version}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch story: ${response.statusText}`);
    }

    const data = await response.json();
    return data.story;
  }

  isInStoryblokEditor(): boolean {
    return this.isInEditor;
  }

  destroy(): void {
    this.callbacks.clear();
    
    if (this.urlCleanupInterval) {
      clearInterval(this.urlCleanupInterval);
      this.urlCleanupInterval = null;
    }
    
    if (window.sbBridge) {
      delete window.sbBridge;
    }
  }

  getCleanPathname(): string {
    return this.cleanPathname;
  }

  navigate(path: string, options?: any): void {
    if (this.router) {
      const cleanPath = this.removeStoryblokParamsFromUrl(path);
      this.router.push(cleanPath, options);
    }
  }
}

// Enhanced StoryblokProvider with component support
export function StoryblokProvider({ 
  children, 
  config, 
  storySlug = 'home', 
  router,
  components = {} 
}: StoryblokProviderProps) {
  const [sdk] = useState(() => {
    const sdkInstance = new StoryblokSDK(config, router, components);
    // Register components globally
    sdkInstance.registerComponents(components);
    return sdkInstance;
  });
  
  const [draftContent, setDraftContent] = useState<StoryblokStory | null>(null);
  const [publishedContent, setPublishedContent] = useState<StoryblokStory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventCount, setEventCount] = useState(0);
  const [isInEditor, setIsInEditor] = useState(false);
  const initializationRef = useRef(false);

  const refreshContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [draft, published] = await Promise.all([
        sdk.fetchStory(storySlug, 'draft').catch(() => null),
        sdk.fetchStory(storySlug, 'published').catch(() => null)
      ]);

      setDraftContent(draft);
      setPublishedContent(published);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      if (config.debug) {
        console.error('[Storyblok SDK] Error fetching content:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [sdk, storySlug, config.debug]);

  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    setIsInEditor(sdk.isInStoryblokEditor());

    const initializeSDK = async () => {
      try {
        await sdk.loadBridge();
        await refreshContent();

        sdk.on('input', (data: any) => {
          if (data && data.story) {
            setDraftContent(data.story);
            setEventCount(prev => prev + 1);
          }
        });

        sdk.on('published', async () => {
          setEventCount(prev => prev + 1);
          await refreshContent();
        });

        const events: StoryblokEventType[] = [
          'change', 'unpublished', 'viewLiveVersion', 'enterEditmode', 
          'enterComponent', 'hoverComponent', 'highlightComponent',
          'customEvent', 'pingBack', 'sessionReceived', 'editedBlok', 
          'deselectBlok', 'addedBlock', 'deletedBlock', 'movedBlock', 
          'duplicatedBlock'
        ];

        events.forEach(event => {
          sdk.on(event, () => {
            setEventCount(prev => prev + 1);
          });
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize SDK');
        if (config.debug) {
          console.error('[Storyblok SDK] Initialization error:', err);
        }
      }
    };

    initializeSDK();

    return () => {
      sdk.destroy();
    };
  }, [sdk, refreshContent, config.debug]);

  const contextValue: StoryblokContextType = {
    draftContent,
    publishedContent,
    isInEditor,
    isLoading,
    error,
    eventCount,
    refreshContent,
    sdk,
    // Add render method to context
    renderContent: sdk.renderStoryblokContent.bind(sdk),
  };

  return React.createElement(
    StoryblokContext.Provider,
    { value: contextValue },
    children
  );
}

export function useStoryblok(): StoryblokContextType {
  const context = useContext(StoryblokContext);
  if (!context) {
    throw new Error('useStoryblok must be used within a StoryblokProvider');
  }
  return context;
}

// Storyblok initialization function (similar to Next.js)
export function storyblokInit(options: StoryblokOptions) {
  const { config, components = {} } = options;
  
  // Register components globally
  globalComponents = { ...globalComponents, ...components };
  
  return {
    // Create SDK instance
    createSDK: (router?: any) => new StoryblokSDK(config, router, components),
    
    // Get registered components
    getComponents: () => globalComponents,
    
    // Register additional components
    registerComponent: (name: string, component: React.ComponentType<any>) => {
      globalComponents[name] = component;
    },
    
    // Register multiple components
    registerComponents: (newComponents: Record<string, React.ComponentType<any>>) => {
      Object.assign(globalComponents, newComponents);
    }
  };
}

// Storyblok editable wrapper component
interface StoryblokEditableProps {
  content: any;
  children: React.ReactNode;
}

export function StoryblokEditable({ content, children }: StoryblokEditableProps) {
  const editableProps = content._editable 
    ? { dangerouslySetInnerHTML: { __html: content._editable } }
    : {};

  return React.createElement('div', editableProps, children);
}

// Hook for rendering Storyblok content
export function useStoryblokContent() {
  const { sdk, draftContent, publishedContent, isInEditor } = useStoryblok();
  
  const currentContent = isInEditor ? draftContent : publishedContent;
  
  const renderContent = useCallback((content?: any) => {
    const contentToRender = content || currentContent?.content;
    return sdk?.renderStoryblokContent(contentToRender);
  }, [sdk, currentContent]);

  return {
    content: currentContent,
    draftContent,
    publishedContent,
    isInEditor,
    renderContent,
  };
}

export function useStoryblokStory(slug: string) {
  const { sdk, isInEditor } = useStoryblok();
  const [draftContent, setDraftContent] = useState<StoryblokStory | null>(null);
  const [publishedContent, setPublishedContent] = useState<StoryblokStory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    if (!sdk) return;

    try {
      setIsLoading(true);
      setError(null);

      const [draft, published] = await Promise.all([
        sdk.fetchStory(slug, 'draft').catch(() => null),
        sdk.fetchStory(slug, 'published').catch(() => null)
      ]);

      setDraftContent(draft);
      setPublishedContent(published);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error(`[Storyblok SDK] Error fetching story "${slug}":`, err);
    } finally {
      setIsLoading(false);
    }
  }, [sdk, slug]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Listen for Storyblok editor events and refresh if the current story is being edited
  useEffect(() => {
    if (!sdk || !isInEditor) return;

    const handleInput = (data: any) => {
      // Check if the updated story matches our current slug
      if (data?.story?.slug === slug || data?.story?.full_slug === slug) {
        setDraftContent(data.story);
      }
    };

    const handlePublished = async (data: any) => {
      // Refresh content when published
      if (!data || data?.story?.slug === slug || data?.story?.full_slug === slug) {
        await fetchContent();
      }
    };

    sdk.on('input', handleInput);
    sdk.on('published', handlePublished);

    return () => {
      sdk.off('input', handleInput);
      sdk.off('published', handlePublished);
    };
  }, [sdk, isInEditor, slug, fetchContent]);

  const currentContent = isInEditor ? draftContent : publishedContent;

  const renderContent = useCallback((content?: any) => {
    const contentToRender = content || currentContent?.content;
    return sdk?.renderStoryblokContent(contentToRender);
  }, [sdk, currentContent]);

  return {
    story: currentContent,
    draftContent,
    publishedContent,
    isLoading,
    error,
    isInEditor,
    renderContent,
    refreshContent: fetchContent,
  };
}


// Hook to get specific components from a story
export function useStoryblokComponent(slug: string, componentType: string) {
  const { story } = useStoryblokStory(slug);
  
  const component = story?.content?.body?.find((blok: any) => blok.component === componentType);
  
  return component || null;
}

// Hook to get all components of a specific type from a story
export function useStoryblokComponents(slug: string, componentType: string) {
  const { story } = useStoryblokStory(slug);
  
  const components = story?.content?.body?.filter((blok: any) => blok.component === componentType) || [];
  
  return components;
}


export { StoryblokConfig, StoryblokStory, StoryblokEvent, StoryblokEventType };