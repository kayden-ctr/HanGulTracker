/**
 * Root index redirect.
 * Immediately sends the user into the (tabs) group so the tab bar shows up.
 */

import { Redirect } from 'expo-router';

export default function RootIndex() {
  return <Redirect href="/(tabs)" />;
}
