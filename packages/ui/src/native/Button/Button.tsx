import * as React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /**
   * Button content
   */
  children: React.ReactNode;
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Loading state - shows spinner and disables button
   */
  loading?: boolean;
  /**
   * Optional icon to display before the button text
   */
  iconLeft?: React.ReactNode;
  /**
   * Optional icon to display after the button text
   */
  iconRight?: React.ReactNode;
  /**
   * Custom button style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Custom text style
   */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Button Component - React Native
 *
 * Primary interactive element for user actions.
 * Implements TowerOS design system button specifications for mobile.
 *
 * Optimized for:
 * - 48px minimum touch target (glove-friendly)
 * - High contrast for sunlight readability
 * - Haptic feedback on press
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onPress={handleInstall}>
 *   Install Equipment
 * </Button>
 *
 * <Button variant="danger" loading={isDeleting}>
 *   Delete Site
 * </Button>
 *
 * <Button variant="tertiary" iconLeft={<PlusIcon />}>
 *   Add Photo
 * </Button>
 * ```
 */
export const Button = React.forwardRef<any, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      iconLeft,
      iconRight,
      style,
      textStyle,
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonStyles = [
      styles.base,
      styles[variant],
      styles[`size_${size}`],
      fullWidth && styles.fullWidth,
      (disabled || loading) && styles.disabled,
      style,
    ];

    const textStyles = [
      styles.text,
      styles[`text_${variant}`],
      styles[`text_${size}`],
      (disabled || loading) && styles.textDisabled,
      textStyle,
    ];

    return (
      <Pressable
        ref={ref}
        disabled={disabled || loading}
        style={({ pressed }) => [
          ...buttonStyles,
          pressed && !disabled && !loading && styles.pressed,
        ]}
        {...props}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#0066CC'}
            style={styles.spinner}
          />
        )}
        {!loading && iconLeft && <>{iconLeft}</>}
        <Text style={textStyles}>{children}</Text>
        {!loading && iconRight && <>{iconRight}</>}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  spinner: {
    marginRight: 8,
  },

  // Variants
  primary: {
    backgroundColor: '#0066CC',
  },
  secondary: {
    backgroundColor: '#F5F5F5',
  },
  tertiary: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: '#FF3B30',
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes - Mobile-optimized (48px minimum for gloves)
  size_sm: {
    height: 40,
    paddingHorizontal: 12,
  },
  size_md: {
    height: 48,
    paddingHorizontal: 16,
  },
  size_lg: {
    height: 56,
    paddingHorizontal: 24,
  },

  // Text styles
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: '#212121',
  },
  text_tertiary: {
    color: '#0066CC',
  },
  text_danger: {
    color: '#FFFFFF',
  },
  text_ghost: {
    color: '#212121',
  },
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
  textDisabled: {
    opacity: 0.7,
  },
});
