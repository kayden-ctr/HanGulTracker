/**
 * Splash Screen
 *
 * Shown on first launch. Displays the app logo, title, and Korean subtitle
 * over a blue gradient, then fades out into the onboarding flow.
 *
 * Animation timeline (ms):
 *   0      → logo fades + slides up
 *   300    → title fades in
 *   600    → subtitle fades in
 *   1800   → hold
 *   2200   → entire screen fades out → router pushes to /onboarding
 */

import { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const DURATION = 600;
const EASE = Easing.out(Easing.cubic);

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // --- shared values ---
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(24);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  // --- animated styles ---
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  function navigateAway() {
    if (onFinish) {
      onFinish();
    } else {
      router.replace('/onboarding');
    }
  }

  useEffect(() => {
    // Logo enters
    logoOpacity.value = withTiming(1, { duration: DURATION, easing: EASE });
    logoTranslateY.value = withTiming(0, { duration: DURATION, easing: EASE });

    // Title fades in after 300 ms
    titleOpacity.value = withDelay(300, withTiming(1, { duration: DURATION, easing: EASE }));

    // Subtitle fades in after 600 ms
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: DURATION, easing: EASE }));

    // Hold then fade entire screen out
    screenOpacity.value = withDelay(
      2200,
      withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(navigateAway)();
      }),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.root, screenStyle]}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#099FFC', '#B4F2FC']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {/* Logo mark */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.logoBox}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* App title */}
        <Animated.Text style={[styles.title, titleStyle]}>
          HanGul Tracker
        </Animated.Text>

        {/* Korean subtitle */}
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          한글을 매일 배우세요
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#099FFC',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },

  // Logo
  logoContainer: {
    marginBottom: 8,
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    // backdrop blur simulation via layered backgrounds on native
    shadowColor: '#0484FC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  logoImage: {
    width: 64,
    height: 64,
  },

  // Title
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },

  // Subtitle
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
