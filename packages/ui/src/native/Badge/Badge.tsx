import * as React from 'react';
import { View, Text, StyleSheet, type ViewProps, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';

export interface BadgeProps extends ViewProps {
  /**
   * Badge content
   */
  children: React.ReactNode;
  /**
   * Badge variant
   */
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'alpha'
    | 'beta'
    | 'gamma'
    | 'delta';
  /**
   * Badge size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional icon to display before text
   */
  icon?: React.ReactNode;
  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Custom text style
   */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Badge Component - React Native
 *
 * Small status indicator or label.
 * Implements TowerOS design system badge specifications for mobile.
 *
 * @example
 * ```tsx
 * <Badge variant="success">In Service</Badge>
 * <Badge variant="danger">Critical</Badge>
 * <Badge variant="alpha">Sector Alpha</Badge>
 * <Badge variant="primary" icon={<CheckIcon />}>
 *   Completed
 * </Badge>
 * ```
 */
export const Badge = React.forwardRef<View, BadgeProps>(
  (
    {
      children,
      variant = 'default',
      size = 'sm',
      icon,
      style,
      textStyle,
      ...props
    },
    ref
  ) => {
    const containerStyles = [
      styles.base,
      styles[variant],
      styles[`size_${size}`],
      style,
    ];

    const textStyles = [
      styles.text,
      styles[`text_${variant}`],
      styles[`text_${size}`],
      textStyle,
    ];

    return (
      <View ref={ref} style={containerStyles} {...props}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={textStyles}>{children}</Text>
      </View>
    );
  }
);

Badge.displayName = 'Badge';

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  icon: {
    marginRight: 4,
  },

  // Variants
  default: {
    backgroundColor: '#F5F5F5',
  },
  primary: {
    backgroundColor: '#E3F2FD',
  },
  success: {
    backgroundColor: '#E8F5E9',
  },
  warning: {
    backgroundColor: '#FFF3E0',
  },
  danger: {
    backgroundColor: '#FF3B30',
  },
  info: {
    backgroundColor: '#E3F2FD',
  },
  alpha: {
    backgroundColor: '#FFEBEE',
  },
  beta: {
    backgroundColor: '#E3F2FD',
  },
  gamma: {
    backgroundColor: '#E8F5E9',
  },
  delta: {
    backgroundColor: '#FFF3E0',
  },

  // Sizes
  size_sm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  size_md: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  size_lg: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  // Text styles
  text: {
    fontWeight: '500',
  },
  text_default: {
    color: '#616161',
  },
  text_primary: {
    color: '#0066CC',
  },
  text_success: {
    color: '#00B050',
  },
  text_warning: {
    color: '#FF9500',
  },
  text_danger: {
    color: '#FFFFFF',
  },
  text_info: {
    color: '#007AFF',
  },
  text_alpha: {
    color: '#FF3B30',
  },
  text_beta: {
    color: '#007AFF',
  },
  text_gamma: {
    color: '#00B050',
  },
  text_delta: {
    color: '#FF9500',
  },
  text_sm: {
    fontSize: 12,
  },
  text_md: {
    fontSize: 14,
  },
  text_lg: {
    fontSize: 16,
  },
});
