import React, { useState, forwardRef, Ref, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle, TextInputProps, Keyboard, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, interpolateColor } from 'react-native-reanimated';
import { formatPhoneNumber } from '@/utils/validation';

interface AnimatedInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  error?: string | null;
  helperText?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperTextStyle?: TextStyle;
  formatPhoneNumber?: boolean;
  themeColors?: {
    primary: string;
    background: string;
    error: string;
    text: string;
    placeholder: string;
    border: string;
  };
}

import { TouchableOpacity } from 'react-native';

export const AnimatedInput = forwardRef((
  {
    label,
    icon,
    error,
    helperText,
    containerStyle,
    labelStyle,
    inputStyle,
    errorStyle,
    helperTextStyle,
    formatPhoneNumber: shouldFormatPhone = false,
    themeColors = {
      primary: '#FF8C00',
      background: '#F9FAFB',
      error: '#DC2626',
      text: '#1F2937',
      placeholder: '#9CA3AF',
      border: '#D1D5DB'
    },
    ...inputProps
  }: AnimatedInputProps,
  ref: Ref<TextInput>
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(inputProps.value as string || '');
  
  // Animation values
  const focusAnim = useSharedValue(0);
  const errorAnim = useSharedValue(error ? 1 : 0);
  const shakeAnim = useSharedValue(0);
  
  // Format phone number if needed
  const handleChangeText = useCallback((text: string) => {
    setLocalValue(text);
    
    if (shouldFormatPhone && inputProps.keyboardType === 'phone-pad') {
      // Only pass the formatted value to the parent if we're not in the middle of typing
      const formattedValue = text.startsWith('+243') || text.startsWith('243') 
        ? formatPhoneNumber(text)
        : text;
      
      if (inputProps.onChangeText) {
        inputProps.onChangeText(text);
      }
    } else if (inputProps.onChangeText) {
      inputProps.onChangeText(text);
    }
  }, [inputProps.onChangeText, shouldFormatPhone, inputProps.keyboardType]);
  
  // Update animations when focus or error state changes
  React.useEffect(() => {
    focusAnim.value = withTiming(
      isFocused || (inputProps.value && inputProps.value.toString().length > 0) ? 1 : 0, 
      { duration: 200 }
    );
  }, [isFocused, inputProps.value]);
  
  React.useEffect(() => {
    // Animate error state
    errorAnim.value = withTiming(error ? 1 : 0, { duration: 200 });
    
    // Add shake animation when error appears
    if (error) {
      shakeAnim.value = 0;
      shakeAnim.value = withTiming(1, { duration: 300 });
    }
  }, [error]);
  
  // Animated styles
  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withTiming(isFocused || (inputProps.value && inputProps.value.toString().length > 0) ? -25 : 0, { duration: 200 }) },
        { scale: withTiming(isFocused || (inputProps.value && inputProps.value.toString().length > 0) ? 0.85 : 1, { duration: 200 }) }
      ],
      color: interpolateColor(
        focusAnim.value,
        [0, 1],
        [themeColors.placeholder, themeColors.primary]
      ),
    };
  });
  
  const containerAnimatedStyle = useAnimatedStyle(() => {
    // Add shake animation when error appears
    const shake = shakeAnim.value * 10 * Math.sin(shakeAnim.value * Math.PI * 5);
    
    return {
      transform: [{ translateX: shake }],
      borderColor: interpolateColor(
        errorAnim.value,
        [0, 1],
        [interpolateColor(focusAnim.value, [0, 1], [themeColors.border, themeColors.primary]), themeColors.error]
      ),
      borderWidth: withTiming(isFocused ? 2 : 1, { duration: 200 }),
      backgroundColor: withTiming(isFocused ? '#FFFFFF' : themeColors.background, { duration: 200 }),
    };
  });
  
  // Helper text animated style
  const helperTextAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(helperText ? 1 : 0, { duration: 200 }),
      transform: [{ translateY: withTiming(helperText ? 0 : -10, { duration: 200 }) }],
    };
  });

  // Handle dismissing keyboard on tap outside
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.field, containerStyle]}>
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={dismissKeyboard}
        style={{ width: '100%' }}
      >
        <Animated.View style={[styles.inputContainer, containerAnimatedStyle]}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <View style={styles.inputWrapper}>
            <Animated.Text 
              style={[styles.label, labelAnimatedStyle, labelStyle]}
              accessibilityLabel={`${label} field`}
            >
              {label}
            </Animated.Text>
            <TextInput
              ref={ref}
              style={[styles.input, { color: themeColors.text }, inputStyle]}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholderTextColor={themeColors.placeholder}
              value={localValue}
              onChangeText={handleChangeText}
              accessibilityLabel={label}
              accessibilityHint={helperText || ''}
              accessibilityState={{ 
                disabled: inputProps.editable === false,
                selected: isFocused
              }}
              {...inputProps}
            />
          </View>
        </Animated.View>
      </TouchableOpacity>
      
      {/* Error message with animation */}
      {error && (
        <Animated.Text 
          style={[styles.errorText, errorStyle]} 
          accessibilityRole="alert"
        >
          {error}
        </Animated.Text>
      )}
      
      {/* Helper text with animation */}
      {helperText && !error && (
        <Animated.Text 
          style={[styles.helperText, helperTextAnimatedStyle, helperTextStyle]}
          accessibilityRole="text"
        >
          {helperText}
        </Animated.Text>
      )}
    </View>
  );
}

);

export default AnimatedInput;

const styles = StyleSheet.create({
  field: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 25,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: '500',
    left: 0,
    top: 0,
  },
  input: {
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 0,
    height: 25,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 4,
  },
  helperText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});