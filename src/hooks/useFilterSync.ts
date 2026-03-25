import { useEffect } from 'react';
import { useFilterStore } from '../store/filterStore';

export function useFilterSync() {
  const initFromUrl = useFilterStore((s) => s.initFromUrl);

  useEffect(() => {
    // Initialize filters from URL on mount
    initFromUrl();

    // Listen for browser back/forward to restore filters
    const handlePopState = () => {
      initFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initFromUrl]);
}
