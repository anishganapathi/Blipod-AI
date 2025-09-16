import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function useGlobalInlineEditor() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const observer = new MutationObserver(() => {
      // Find all text nodes inside the app root
      const textNodes = Array.from(document.querySelectorAll('span, p, h1, h2, h3, h4, h5, h6, div'))
        .filter(el => el.children.length === 0 && el.textContent?.trim());

      textNodes.forEach(el => {
        const htmlEl = el as HTMLElement;

        if (!htmlEl.hasAttribute('data-editable')) {
          htmlEl.setAttribute('contentEditable', 'true');
          htmlEl.setAttribute('data-editable', 'true'); // mark as processed
          htmlEl.style.outline = '1px dashed gray';
          htmlEl.style.cursor = 'text';

          htmlEl.addEventListener('input', (e) => {
            console.log('Edited text:', (e.target as HTMLElement).innerText);
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);
}
