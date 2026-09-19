/**
 * Root index — entry point gate
 *
 * On every cold launch this screen checks whether the user has already
 * completed onboarding (stored in AsyncStorage).
 *
 * - First launch  → /splash  (splash fades into /onboarding)
 * - Return visit  → /(tabs)  (skip splash + onboarding entirely)
 *
 * A loading state is shown while AsyncStorage resolves so we never flash
 * the wrong screen.
 */

import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { getItem, STORAGE_KEYS } from '@/services/storage/storageService';

type Destination = 'splash' | '/(tabs)' | null;

export default function RootIndex() {
  const [destination, setDestination] = useState<Destination>(null);

  useEffect(() => {
    async function check() {
      const done = await getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE);
      setDestination(done ? '/(tabs)' : 'splash');
    }
    check();
  }, []);

  // Still resolving — render a blank screen that matches the splash
  // background so there's no white flash.
  if (destination === null) {
    return <View style={styles.blank} />;
  }

  return <Redirect href={destination as any} />;
}

const styles = StyleSheet.create({
  blank: {
    flex: 1,
    backgroundColor: '#099FFC',
  },
});
