import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useState } from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  subtitle?: string;
  badge?: string;
  onPress?: () => void;
}

export function DashboardCard({ title, value, icon, color, subtitle, badge, onPress }: DashboardCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Handle press animations
  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 10, stiffness: 100 });
    setIsPressed(true);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    setIsPressed(false);
  };

  // Generate gradient colors based on the primary color
  const getGradientColors = () => {
    // Create a lighter version of the color for gradient effect
    return [color, color + '80'] as const; // Adding 80 for 50% opacity and 'as const' for readonly tuple type
  };

  return (
    <Animated.View style={[animatedStyle, styles.container]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.touchable}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          {badge && (
            <View style={[styles.badgeContainer, { borderColor: color }]}>
              <Text style={[styles.badgeText, { color }]}>{badge}</Text>
            </View>
          )}
        </LinearGradient>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.value, { color }]}>{value}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150, // Largeur fixe pour uniformiser les cartes
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 0, // Suppression de la marge du bas pour éliminer l'espace entre les cartes
    height: 150, // Hauteur fixe pour uniformiser les cartes
  },
  touchable: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    height: '100%', // Assurer que le touchable prend toute la hauteur
  },
  gradient: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Pour positionner le badge
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  content: {
    padding: 12, // Réduction du padding pour s'adapter à la taille fixe
    flex: 1, // Permet au contenu de prendre l'espace restant
    justifyContent: 'space-between', // Répartit l'espace verticalement
  },
  title: {
    fontSize: 13, // Réduction légère de la taille pour s'adapter à la taille fixe
    color: '#6B7280',
    marginBottom: 4, // Réduction de la marge pour s'adapter à la taille fixe
    fontWeight: '500',
  },
  value: {
    fontSize: 18, // Réduction légère de la taille pour s'adapter à la taille fixe
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 11, // Réduction légère de la taille pour s'adapter à la taille fixe
    color: '#6B7280',
    marginTop: 2, // Réduction de la marge pour s'adapter à la taille fixe
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});