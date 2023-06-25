import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export const useCachedResources = (): boolean => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'circular-normal': require('../../assets/fonts/CircularXXSub-Book.ttf'),
          'circular-medium': require('../../assets/fonts/CircularXXSub-Medium.ttf'),
          'circular-bold': require('../../assets/fonts/CircularXXSub-Bold.ttf')
        });
      } catch (error) {
        // We might want to provide this error information to an error reporting service
        console.warn(error);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
};
