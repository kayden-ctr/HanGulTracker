/**
 * ContinueLearningButton
 *
 * A full-width call-to-action card that sits prominently on the Home
 * Dashboard. Shows the current lesson title, a short description, and
 * an arrow chevron. Uses the blue gradient background to draw the eye.
 *
 * Props:
 *   lessonTitle   — name of the next lesson to resume
 *   description   — one-line context, e.g. "Continue where you left off"
 *   onPress       — tap handler
 *   disabled      — grays out the button when no lesson is available
 */

import { Pressable, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface ContinueLearningButtonProps {
  lessonTitle: string;
  description?: string;
  onPress: () => void;
  disabled?: boolean;
}

export function ContinueLearningButton({
  lessonTitle,
  description,
  onPress,
  disabled = false,
}: ContinueLearningButtonProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Continue learning: ${lessonTitle}`}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <LinearGradient
        colors={['#099FFC', '#2FADFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, theme.shadow.lg]}
      >
        {/* Left: text content */}
        <View style={styles.textBlock}>
          <Text style={styles.eyebrow}>CONTINUE LEARNING</Text>
          <Text style={styles.title} numberOfLines={1}>
            {lessonTitle}
          </Text>
          {description ? (
            <Text style={styles.description} numberOfLines={1}>
              {description}
            </Text>
          ) : null}
        </View>

        {/* Right: chevron pill */}
        <View style={styles.chevronPill}>
          <Text style={styles.chevronText}>›</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 22,
    borderRadius: 20,
    gap: 12,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.80)',
    letterSpacing: 0.1,
  },
  chevronPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 30,
    marginLeft: 2,
  },
});
