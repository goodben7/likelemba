import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface QuickActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  iconStyle?: TextStyle;
  gradientColors?: readonly [string, string, ...string[]];
  accessibilityLabel?: string;
}

export function QuickActionButton({
  icon,
  label,
  onPress,
  style,
  labelStyle,
  iconStyle,
  gradientColors = ['#FFFFFF', '#F9FAFB'] as const,
  accessibilityLabel,
}: QuickActionButtonProps) {
  // Animation values
  const scale = useSharedValue(1);
  const elevation = useSharedValue(3);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      elevation: elevation.value,
    };
  });

  // Handle press animations
  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 100 });
    elevation.value = withTiming(1, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    elevation.value = withTiming(3, { duration: 150 });
  };

  return (
    <Animated.View style={[animatedStyle, styles.container, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Text style={[styles.icon, iconStyle]}>{icon}</Text>
          <Text style={[styles.label, labelStyle]} numberOfLines={2}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 4,
  },
  touchable: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  gradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  icon: {
    fontSize: 28,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});