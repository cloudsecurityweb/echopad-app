import { useEffect } from 'react';

/**
 * Hook to dynamically load external scripts
 * @param {string} src - Script source URL
 * @param {object} options - Options for script loading
 */
export function useScript(src, options = {}) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = options.async !== false;
    script.defer = options.defer || false;
    
    if (options.id) {
      script.id = options.id;
    }
    
    if (options.onLoad) {
      script.onload = options.onLoad;
    }
    
    if (options.onError) {
      script.onerror = options.onError;
    }
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup: remove script when component unmounts
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [src, options]);
}






